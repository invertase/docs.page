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

const visit = async (dir: string, done: any) => {
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
          visit(file, function (_error, res) {
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

  await visit(localPath, (error, entries) => {
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


var Component=(()=>{var m=Object.create;var s=Object.defineProperty;var j=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var x=Object.getPrototypeOf,_=Object.prototype.hasOwnProperty;var a=t=>s(t,"__esModule",{value:!0});var p=(t,n)=>()=>(n||t((n={exports:{}}).exports,n),n.exports),g=(t,n)=>{a(t);for(var e in n)s(t,e,{get:n[e],enumerable:!0})},l=(t,n,e)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of u(n))!_.call(t,r)&&r!=="default"&&s(t,r,{get:()=>n[r],enumerable:!(e=j(n,r))||e.enumerable});return t},d=t=>l(a(s(t!=null?m(x(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var i=p((F,c)=>{c.exports=_jsx_runtime});var h={};g(h,{default:()=>b});var o=d(i());function f(t={}){let n=Object.assign({},t.components),{wrapper:e}=n,r=(0,o.jsx)(o.Fragment,{children:"{SerializationError}"});return e?(0,o.jsx)(e,Object.assign({},t,{children:r})):r}var b=f;return h;})();\n' +
    ';return Component.default;'