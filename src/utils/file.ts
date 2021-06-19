import domains from '../../domains.json';
import repositories from '../../repositories.json';

export type DomainListItem = [string, string];

/**
 * Returns an array of all domains & associated repositories
 * @returns
 */
export function getDomainsList(): DomainListItem[] {
  return domains as DomainListItem[];
}

/**
 * Returns an array of all domains & associated repositories
 * @returns
 */
export function getRepositoriesList(): string[] {
  return repositories as string[];
}
