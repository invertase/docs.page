import A2A from 'a2a';
import { config } from 'process';
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

export function getBlameLink(blameUrl, start, end) {
  return `${blameUrl}/#L${start}-L${end}`;
}

export function formatRepoData(properties, filePath, existence) {
  const { owner, repository } = properties;
  const repoData = {
    header: 'Project Details',
    id: 'repoinfo',
    data: [
      ['Field:', 'Looked for:', 'Found:'],
      ['Owner', owner, existence.owner],
      ['Repository', repository, existence.name],
      ['Path', filePath, existence.path],
    ],
  };
  return repoData;
}

export function formatConfigData(content, statusCode) {
  const { name, logo, theme, docsearch, headerDepth } = content.config;

  if (!content.flags.hasConfig || statusCode === 404) {
    return {
      header: 'Configuration',
      id: 'configuration',
      data: [['No configuration file found.']],
    }
  }

  return {
    header: 'Configuration',
    id: 'configuration',
    data: [
      ['Field:', 'Value:'],
      ['Name', name],
      ['Logo', logo],
      ['Theme', theme],
      ['DocSearch', docsearch],
      ['headerDepth', headerDepth],
    ],
  };
}

export function formatWarningDebugData(warnings,statusCode) {
  if (!warnings.length || statusCode===404) {
    return {
      header: 'Warnings',
      id: 'warnings',
      data: [['No warnings were detected.']],
    }
  }
  return {
    header: "Warnings",
    id: "warnings",
    data: [
      ['Warning','Line','Column','Detail'],
      ...warnings
    ]
  }
}