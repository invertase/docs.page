import { createNodeMiddleware, Probot, createProbot } from 'probot';

// Create a probot instance for the docs.page app
const probot = createProbot({
  overrides: {
    appId: process.env.GITHUB_APP_ID,
    privateKey: JSON.parse(`"${process.env.GITHUB_APP_PRIVATE_KEY}"`),
  },
});

// Queries a repository and extracts a file
const getFile = `
  query GetDomains($owner: String!, $repo: String!, $file: String!) {
    repository(owner: $owner, name: $repo) {
      file: object(expression: $file) {
        ... on Blob {
          text
        }
      }
    }
  }
`;

// Type for a getFile response - assumes the repository is available
type GetFileResponse = {
  repository: {
    file?: {
      text: string;
    };
  };
};


const getPaths = `
query getPaths($owner: String!, $repo: String!, $number: Int!, cursor: String = "") {
  repository(name: $repo, owner: $owner) {
    pullRequest(number: $number) {
      id
      files(first: 2, after: $cursor) {
        edges {
          node {
            path
          }
          cursor
        }
      }
    }
  }
}
`

function checkPathsResponse(paths: GetPathsResponse) {
  const edges = paths.repository.pullRequest.files.edges
  const docsChanged = edges.some(edge => edge.node.path.startsWith('docs/'))
  const configChanged = edges.some(edge => ["docs.json", "docs.yaml"].includes(edge.node.path))
  return docsChanged || configChanged;
}

function getLastFileCursor(getPathsResponse: GetPathsResponse) {
  const edges = getPathsResponse.repository.pullRequest.files.edges
  return edges[edges.length - 1].cursor
}


function checkCommentsResponse(comments: GetCommentsResponse) {
  const edges = comments.repository.pullRequest.comments.edges
  const hasCommented = edges.some(edge => edge.node.author.login === "docs-page")
  return hasCommented;
}

function getLastCommentCursor(getCommentsResponse: GetCommentsResponse) {
  const edges = getCommentsResponse.repository.pullRequest.comments.edges
  return edges[edges.length - 1].cursor
}

type GetPathsResponse = {
  repository: {
    pullRequest: {
      files: {
        edges: {
          node: {
            path: string
          }
          cursor: string
        }[]
      }
    }
  }
}

const getFirstComments = `
  query getComments($owner: String!, $repo: String!, $number: Int!) {
    repository(name: $repo, owner: $owner) {
      pullRequest(number: $number) {
        comments(first: 100) {
          edges {
            node {
              author {
                login
              }
            }
            cursor
          }
          totalCount
        }
      }
    }
  }
`
const getComments = `
  query getComments($owner: String!, $repo: String!, $number: Int!, cursor: String!) {
    repository(name: $repo, owner: $owner) {
      pullRequest(number: $number) {
        comments(first: 100, after: $cursor) {
          edges {
            node {
              author {
                login
              }
            }
            cursor
          }
        }
      }
    }
  }
`

type GetCommentsResponse = {
  repository: {
    pullRequest: {
      comments: {
        edges: {
          node: {
            author: {
              login: string
            }
          }
          cursor: string
        }[],
        totalCount?: number
      }
    }
  }
}


const app = (app: Probot) => {
  app.on(['pull_request.opened', 'pull_request.synchronize'], async context => {
    app.log.info(context);

    const { repository, pull_request } = context.payload;

    const totalChangedFiles = pull_request.changed_files;

    let totalFilesChecked = 0;
    let shouldComment = false;
    let cursor = '';

    // check files in batches of 100 until we find a docs file or we've checked all files
    while (totalFilesChecked < totalChangedFiles && !shouldComment) {

      const getPathsResponse = await context
        .octokit
        .graphql<GetPathsResponse>(getPaths, {
          owner: repository.owner.login,
          repo: repository.name,
          number: pull_request.number,
          cursor
        });

      shouldComment = checkPathsResponse(getPathsResponse);
      cursor = getLastFileCursor(getPathsResponse);
    }

    // check to see if we've commented before
    

    // for some reason an empty cursor doesn't work for comments, so we have to obtain the first cursor manually.
    const getFirstCommentsResponse = await context
    .octokit
    .graphql<GetCommentsResponse>(getFirstComments, {
      owner: repository.owner.login,
      repo: repository.name,
      number: pull_request.number,
    });
    
    let totalComments = getFirstCommentsResponse.repository.pullRequest.comments.totalCount;
    let totalCommentsChecked = getFirstCommentsResponse.repository.pullRequest.comments.edges.length;
    let commentCursor = getLastCommentCursor(getFirstCommentsResponse);
    let hasCommented = checkCommentsResponse(getFirstCommentsResponse);
    
    while (totalCommentsChecked < totalComments! && !hasCommented) {
      const getCommentsResponse = await context
        .octokit
        .graphql<GetCommentsResponse>(getComments, {
          owner: repository.owner.login,
          repo: repository.name,
          number: pull_request.number,
          cursor: commentCursor
        });
        hasCommented = checkCommentsResponse(getCommentsResponse);
        commentCursor = getLastCommentCursor(getCommentsResponse);
    }

    shouldComment = shouldComment && !hasCommented;

    if (!shouldComment) {
      return;
    }

    // e.g. org/repo
    const name = repository.full_name.toLowerCase();

    // Fetch the domains file from the main repository
    const response = await context.octokit.graphql<GetFileResponse>(getFile, {
      owner: 'invertase',
      repo: 'docs.page',
      file: 'main:domains.json',
    });

    const file = response.repository.file?.text || '[]';

    // Find and set a custom domain, if it exists
    const domains = JSON.parse(file) as Array<[string, string]>;
    const domain = domains.find(([, repository]) => repository === name)?.[0];

    const url = domain
      ? `${domain}/~${pull_request.number}`
      : `docs.page/${name}~${pull_request.number}`;

    const comment = context.issue({
      body: `To view this pull requests documentation preview, visit the following URL:\n\n[${url}](https://${url})\n\nDocumentation is deployed and generated using [docs.page](https://docs.page).`,
    });

    await context.octokit.issues.createComment(comment);
  });
};

export default createNodeMiddleware(app, {
  probot,
  webhooksPath: '/webhooks/github',
});
