import A2A from 'a2a';
import { createContext } from 'react';
import { PageContent } from './content';
import { getGithubGQLClient } from './github';
import { Properties } from './properties';
import { IWarning } from './warning';
export type DebugMode = boolean;
export const DebugModeContext = createContext<DebugMode>(false);

interface ExistenceResposne {
  user: {
    login?: string;
  };
  repository: {
    name?: string;
    object?: {
      id?: string;
    };
  };
}

export async function checkExistence(
  owner: string,
  name: string,
  path = 'HEAD:docs',
): Promise<{ owner: string; name: string; path: string }> {
  const [error, response]: [Error, ExistenceResposne | null] = await A2A(
    getGithubGQLClient()({
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

export function getBlameLink(blameUrl: string, start: number, end: number): string {
  return `${blameUrl}/#L${start}-L${end}`;
}

export interface ITableData {
  header: string;
  id: string;
  data: (string | number | boolean)[][];
}

export function formatRepoData(
  properties: Properties,
  filePath: string,
  existence: { owner: string; name: string; path: string },
): ITableData {
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

export function formatConfigData(content: PageContent, statusCode: number): ITableData {
  const { name, logo, theme, docsearch, headerDepth } = content.config;

  if (!content.flags.hasConfig || statusCode === 404) {
    return {
      header: 'Configuration',
      id: 'configuration',
      data: [['No configuration file found.']],
    };
  }

  return {
    header: 'Configuration',
    id: 'configuration',
    data: [
      ['Field:', 'Value:'],
      ['Name', name],
      ['Logo', logo],
      ['Theme', theme],
      ['DocSearch', !!docsearch],
      ['headerDepth', headerDepth],
    ],
  };
}

export function formatWarningDebugData(warnings: IWarning[], statusCode: number): ITableData {
  if (!warnings.length || statusCode === 404) {
    return {
      header: 'Warnings',
      id: 'warnings',
      data: [['No warnings were detected.']],
    };
  }
  return {
    header: 'Warnings',
    id: 'warnings',
    data: [
      ['Warning', 'Line', 'Column', 'Detail'],
      ...warnings.map(w => [w.warningType, w.line, w.column, w.detail]),
    ],
  };
}
