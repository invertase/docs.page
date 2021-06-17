import { readFileSync } from 'fs';
import { join } from 'path';

// [domain, repository]
export type DomainListItem = [string, string];

/**
 * Returns an array of all domains & associated repositories
 * @returns
 */
export function getDomainsList(): DomainListItem[] {
  return readFileSync(join(process.cwd(), 'domains.txt'), 'utf-8')
    .split('\n')
    .map<DomainListItem>(str => str.split(' ') as DomainListItem)
    .filter(line => line.length === 2);
}

/**
 * Returns an array of all domains & associated repositories
 * @returns
 */
export function getRepositoriesList(): string[] {
  return readFileSync(join(process.cwd(), 'repositories.txt'), 'utf-8').split('\n');
}
