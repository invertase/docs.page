export const toArray = (maybeArray: string | string[]): string[] =>
  maybeArray instanceof Array ? maybeArray : [maybeArray];
