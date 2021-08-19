import A2A from 'a2a';
import { createContext } from 'react';
import { GithubGQLClient } from './index';
export type DebugMode = boolean;
export const DebugModeContext = createContext<DebugMode>(false);

export async function checkExistence(
  owner,
  name,
  path = 'HEAD:docs',
): Promise<{ owner: string; name: string; path: string }> {


  const [error, response] = await A2A(
    GithubGQLClient({
      query: `
         query RepositoryPaths($owner: String!, $name: String!, $path: String!) {
                user(login: $owner) {
                login
                }
                repository(owner: $owner, name: $name) {
                name
                object(expression: $path) {
                    id
                }
                }
            }
        `,
      owner: owner,
      name: name.split('~')[0],
      path: path,
    }),
  );

  if (error) {
    console.error(error);
  }
  return {
    owner: response?.user?.login || null,
    name: response?.repository?.name || null,
    path: response?.repository?.object?.id ? path : null,
  };
}
