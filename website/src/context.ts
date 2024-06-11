import { map } from 'nanostores';
import type { BundlerOutput } from './bundle';
import { useStore } from '@nanostores/react';

export type Context = {
  // The owner of the repository (e.g. invertase)
  owner: string;
  // The name of the repository (e.g. docs.page)
  repository: string;
  // The optional ref provided in the URL (invertase/docs.page~next)
  ref: string | undefined;
  // The bundle output from the bundler.
  bundle: BundlerOutput;
  // The domain of the site (e.g. use.docs.page), matched from the domains.json file
  domain: string | undefined;
  // The request object from the server.
  request: Request;
};

const store = map<Context>();

export default store;

export function useContext() {
  return useStore(store);
}
