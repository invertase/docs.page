import { graphql } from '@octokit/graphql';
import get from 'lodash.get';
import NProgress from 'nprogress';

declare global {
  interface Window {
    _docs_page: {
      syncTabs: () => void;
    };
  }
}

export function isString(value: any) {
  return typeof value === 'string';
}

export const GithubGQLClient = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_PAT}`,
  },
});

export function headerDepthToHeaderList(depth: number): string[] {
  const list = [];
  if (depth === 0) return list;

  for (let i = 2; i <= depth; i++) {
    list.push(`h${i}`);
  }

  return list;
}

export function tryJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function routeChangeStart() {
  NProgress.start();
}

export function routeChangeComplete() {
  NProgress.done();
  // Trigger the sync-tabs script to run on client route changes
  if (window._docs_page.syncTabs) {
    window._docs_page.syncTabs();
  }
}

export function routeChangeError() {
  NProgress.done();
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isClient(): boolean {
  return typeof window !== 'undefined';
}

// Returns a guaranteed string value from a config object
export function getString<T = string>(json: any, key: string, defaultValue: T): T {
  const value = get<T>(json, key, defaultValue);

  // If there is a custom value but it isn't a string, return the defaultValue instead.
  if (typeof value !== 'string') {
    return defaultValue;
  }

  return value;
}

// Returns a guaranteed number value from a config object
export function getNumber<T = number>(json: any, key: string, defaultValue: T): T {
  const value = get<T>(json, key, defaultValue);

  // If there is a custom value but it isn't a string, return the defaultValue instead.
  if (typeof value !== 'number') {
    return defaultValue;
  }

  return value;
}

// Returns a guaranteed boolean value from a config object
export function getBoolean(json: any, key: string, defaultValue: boolean): boolean {
  const value = get<boolean>(json, key, defaultValue);

  // If there is a custom value but it isn't a string, return the defaultValue instead.
  if (typeof value === 'string') {
    if (value === 'false') return false;
    if (value === 'true') return true;
    return defaultValue;
  }

  if (typeof value !== 'boolean') {
    return defaultValue;
  }

  return value;
}

// Returns a string value ensuring it has a leading `/`
export function leadingSlash(value: string): string {
  if (!value.startsWith('/')) {
    value = `/${value}`;
  }

  return value;
}

export function hash(value: string): string {
  let hash = 0,
    i: number,
    chr: number;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}
