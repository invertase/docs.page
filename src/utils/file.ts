import { join } from 'path';

/**
 * Returns an array of all domains & associated repositories
 * @returns
 */
export function getDomainsList(): Array<[string, string]> {
  return require(join(process.cwd(), 'domains.json'));
}

/**
 * Returns an array of all domains & associated repositories
 * @returns
 */
export function getRepositoriesList(): string[] {
  return require(join(process.cwd(), 'repositories.json'));
}
