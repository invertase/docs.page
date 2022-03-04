import { createNodeMiddleware, createProbot, Probot } from 'probot';

// Create a probot instance for the docs.page app
const probot = createProbot({
  overrides: {
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
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

const app = (app: Probot) => {
  app.on('pull_request.opened', async context => {
    app.log.info(context);

    const pull_request = context.payload.pull_request

    const { repository } = context.payload;

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

export default createNodeMiddleware(app, { probot, webhooksPath: '/webhooks/bot-docs-page' });
