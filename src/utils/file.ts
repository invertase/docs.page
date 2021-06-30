import { readFileSync } from 'fs';
import path, { join } from 'path';

/**
 * Returns an array of all domains & associated repositories
 * @returns
 */
export function getDomainsList(): Array<[string, string]> {
  return JSON.parse(readFileSync(path.join(process.cwd(), 'domains.json'), 'utf-8'));
}

/**
 * Returns an array of all domains & associated repositories
 * @returns
 */
export function getRepositoriesList(): string[] {
  return require(join(process.cwd(), 'repositories.json'));
}
