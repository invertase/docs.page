import { createContext } from 'react';

import { getDomainsList } from './github';
import { Properties } from './properties';

export type CustomDomain = string | null;

export async function getCustomDomain(properties: Properties): Promise<CustomDomain> {
  const domains = await getDomainsList();

  const matcher = `${properties.owner}/${properties.repository}`;

  const match = domains.find(([, repository]) => repository === matcher);

  if (match) {
    return match[0] as CustomDomain;
  }

  return null;
}

export const CustomDomainContext = createContext<CustomDomain>(null);
