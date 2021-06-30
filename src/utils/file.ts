import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Returns an array of all domains & associated repositories
 * @returns
 */
export function getDomainsList(): Array<[string, string]> {
  return JSON.parse(readFileSync(join(process.cwd(), 'domains.json'), 'utf-8'));
}

/**
 * Returns an array of all domains & associated repositories
 * @returns
 */
export function getRepositoriesList(): string[] {
  return JSON.parse(readFileSync(join(process.cwd(), 'repositories.json'), 'utf-8'));
}
