import get from 'lodash.get';

export const getValue = get;

// Returns a guaranteed string value from an object
export function getString(
  json: Record<string, unknown>,
  key: string,
  defaultValue: string,
): string {
  const value = get<Record<string, unknown>, string, string>(json, key, defaultValue);

  // If there is a custom value but it isn't a string, return the defaultValue instead.
  if (typeof value !== 'string') {
    return defaultValue;
  }

  return value;
}

// Returns a guaranteed number value from an object
export function getNumber(
  json: Record<string, unknown>,
  key: string,
  defaultValue: number,
): number {
  const value = get<Record<string, unknown>, string, number>(json, key, defaultValue);

  // If there is a custom value but it isn't a string, return the defaultValue instead.
  if (typeof value !== 'number') {
    return defaultValue;
  }

  return value;
}

// Returns a guaranteed boolean value from an object
export function getBoolean(
  json: Record<string, unknown>,
  key: string,
  defaultValue: boolean,
): boolean {
  const value = get<Record<string, unknown>, string, boolean>(json, key, defaultValue);

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
