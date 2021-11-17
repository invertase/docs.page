import fs from 'fs';
import * as p from 'path';
import os from 'os';
import get from 'lodash.get';
import { Pointer, Properties } from './properties';
import { getBoolean, getString } from '.';
import { ProjectConfig, mergeConfig } from './projectConfig';
import { Frontmatter, PageContent } from './content';
import matter from 'gray-matter';
const localPath = `${os.homedir()}/test-docs`;
const walk = async (dir: string, done: any) => {
  let results = [];

  await fs.readdir(dir, function (error, list) {
    if (error) {
      return done(error);
    }

    let pending = list.length;

    if (!pending) return done(null, results);

    list.forEach(file => {
      file = p.resolve(dir, file);
      fs.stat(file, function (_error, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (_error, res) {
            results = results.concat(res);
            if (!--pending) {
              done(null, results);
            }
          });
        } else {
          results.push(file);
          if (!--pending) {
            done(null, results);
          }
        }
      });
    });
  });
};

export async function getRepositoryPathsLocal(repository: string, dir = 'docs') {
  const [owner, name] = repository.split('/');

  const paths = [];

  await walk(localPath, (error, entries) => {
    if (error) {
      console.error(error);
    }

    for (let i = 0; i < entries.length; i++) {
      const extension = p.extname(entries[i]);

      // const basename = p.basename(entries[i]);

      const path = entries[i];

      // If there is an MDX file, add it to the list

      if (extension === '.mdx') {
        let slug = path
          // Remove "docs/" from the path
          .replace('docs/', '/')
          // Remove .mdx extension
          .slice(0, -4);
        // Remove any "index" page names
        if (slug.endsWith('/index')) {
          slug = slug.slice(0, -5);
        }

        slug = `/${owner}/${name}${slug}`;

        paths.push(slug);
      }
    }
    console.log(paths);

    return paths;
  });
}

type Contents = {
  isFork: boolean;
  baseBranch: string;
  config?: string;
  md?: string;
  path: string;
};

export async function getGitHubContentsLocal(properties: Properties): Promise<Contents | null> {
  const absolutePath = `docs/${properties.path}`;
  const config = JSON.parse(fs.readFileSync(`${localPath}/docs.json`, { encoding: 'utf8' }));
  const md = fs.readFileSync(`${localPath}/${absolutePath}.mdx`, { encoding: 'utf8' });

  return {
    isFork: false,
    baseBranch: 'main',
    config,
    md,
    path: absolutePath,
  };
}

export async function getPageContentLocal(properties: Properties): Promise<PageContent | null> {
  const contents = await getGitHubContentsLocal(properties);

  // Repository not found
  if (!contents) {
    return null;
  }

  let config: ProjectConfig;
  if (contents.config) {
    try {
      const json = JSON.parse(contents.config);
      config = mergeConfig(json || {});
    } catch {
      // Ignore errors
    }
  }

  // Assign the default config if one doesn't already exist
  if (!config) {
    config = mergeConfig({});
  }

  // Find & Replace any "{{ variable }}" values within the content
  const raw = replaceVariables(config.variables, contents.md ?? '');

  const parsed = matter(raw);
  const frontmatter = mergeFrontmatter(parsed.data);
  const markdown = parsed.content;

  return {
    baseBranch: contents.baseBranch,
    path: contents.path,
    config,
    frontmatter,
    headings: [],
    markdown,
    flags: {
      hasConfig: !!contents.config,
      hasFrontmatter: Object.keys(parsed.data).length > 0,
      isFork: contents.isFork,
      isIndexable:
        !!contents.md &&
        !config.noindex &&
        !contents.isFork &&
        properties.pointer === Pointer.base &&
        !!contents.config,
    },
  };
}

function mergeFrontmatter(data: Record<string, string>): Frontmatter {
  return {
    title: getString(data, 'title', ''),
    description: getString(data, 'description', ''),
    image: getString(data, 'image', ''),
    sidebar: getBoolean(data, 'sidebar', true),
    redirect: getString(data, 'redirect', ''),
  };
}

const VARIABLE_REGEX = /{{\s([a-zA-Z0-9_.]*)\s}}/gm;

function replaceVariables(variables: Record<string, string>, value: string) {
  let output = value;
  let m: RegExpExecArray;

  while ((m = VARIABLE_REGEX.exec(value)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === VARIABLE_REGEX.lastIndex) {
      VARIABLE_REGEX.lastIndex++;
    }

    output = output.replace(m[0], get(variables, m[1], ''));
  }

  return output;
}
