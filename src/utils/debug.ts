import A2A from 'a2a';
import { createContext } from 'react';
import { PageContent } from './content';
import { getGithubGQLClient, getRepositoryPaths } from './github';
import { Properties } from './properties';
import { IWarning } from './warning';
export type DebugMode = boolean;

export const DebugModeContext = createContext<DebugMode>(false);

interface ExistenceResposne {
  repository: {
    name?: string;
    mdx?: {
      oid?: string;
    };
    mdxIndex?: {
      oid?: string;
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
            query CheckExistence($owner: String!, $name: String!, $indexPath: String!, $path:String!) {
              repository(owner: $owner, name: $name) {
                name
                mdx:object(expression :$path) {
                  oid
                }
                mdxIndex:object(expression :$indexPath) {
                  oid
                }
              }
            }
        `,
      owner: owner,
      name: name.split('~')[0],
      path: path + '.mdx',
      indexPath: path + '/index.mdx',
    }),
  );

  if (error) {
    console.error(error);
  }

  return {
    owner: response?.repository?.name ? owner : null,
    name: response?.repository?.name || null,
    path: response?.repository?.mdx?.oid || response?.repository?.mdxIndex?.oid ? path : null,
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

// Just processing debug data to make it easy to put in tables. These can probably be refactored away if we decide on a different layout/format.

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
  if (!warnings?.length || statusCode === 404) {
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

export async function getUniquePaths(base: string): Promise<string[][]> {
  const files = await getRepositoryPaths(base);
  const uniqueFiles = Array.from(
    new Set(files.map(path => (path.slice(path.length - 1) === '/' ? path : path + '/'))),
  );
  const formattedFiles = uniqueFiles.map(p => [
    '/docs' + p.slice(base.length + 1),
    p.slice(base.length + 1),
  ]);
  return formattedFiles;
}
