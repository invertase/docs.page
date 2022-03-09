import A2A from 'a2a';
import { getGithubGQLClient } from './github.js';
import path from 'path';
type symLink = {
  mode: string;
  name: string;
  path: string;
  type: string;
  extension: string;
  object: {
    text: string;
  };
  filePath: string;
  formattedPath: string;
};

export async function getRepositorySymLinks(
  owner: string,
  repository: string,
  dir = 'docs',
  ref: string,
): Promise<symLink[]> {
  let symLinks: symLink[] = [];

  const [error, response] = await A2A(
    getGithubGQLClient()({
      query: `
          query RepositoryPaths($owner: String!, $repository: String!, $path: String!) {
            repository(owner: $owner, name: $repository) {
              modes: object(expression: $path) {
                ... on Tree {
                  entries {
                    mode
                    name
                    path
                    type
                    extension
                    object {
                      ... on Blob {
                        text
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      owner: owner,
      repository: repository,
      path: `${ref}:${dir}`,
    }),
  );

  if (error) {
    console.error(error);
    return symLinks;
  }
  //@ts-ignore
  const entries = response?.repository?.modes?.entries ?? [];

  for (let i = 0; i < entries.length; i++) {
    const { mode, path, type, extension } = entries[i];

    // If there is a symlink file, add it to the list
    if (type === 'blob' && extension === '.mdx' && mode == '40960') {
      symLinks.push(entries[i]);
    }

    // If there is a sub-directory fetch any paths for that.
    if (type === 'tree') {
      symLinks = [...symLinks, ...(await getRepositorySymLinks(owner, repository, path, ref))];
    }
  }
  symLinks = symLinks.map(s => ({
    ...s,
    filePath: getFilePath(s),
    formattedPath: s.path.slice('docs/'.length, -'.mdx'.length),
  }));
  return symLinks;
}

export function getFilePath(symlink: symLink): string {
  const { path: filePath, object } = symlink;
  const content = object.text;
  // console.log(path.join(path.dirname(filePath), content));
  return path.join(path.dirname(filePath), content).slice(0, -4);
}
