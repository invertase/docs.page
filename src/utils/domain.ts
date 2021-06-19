import { createContext } from 'react';
import { Properties } from './properties';

export type CustomDomain = string | null;

// NOTE: don't import the getter logic for importing the domains.txt file - the client
// imports this file so we don't have access to "fs"
export function getCustomDomain(domains: [string, string][], properties: Properties): CustomDomain {
  // Find the domain from the list
  const match = domains.find(([, repo]) => {
    return repo === `${properties.owner}/${properties.repository}`;
  });

  if (!match) {
    return null;
  }

  // Return the custom domain
  return match[0];
}

export const CustomDomainContext = createContext<CustomDomain>(null);
