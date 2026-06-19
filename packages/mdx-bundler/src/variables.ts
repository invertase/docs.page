const VARIABLE_REGEX = /{{\s([a-zA-Z0-9_.]*)\s}}/gm;

function getNestedValue(
  variables: Record<string, unknown>,
  path: string,
  fallback: string,
): string {
  const value = path.split(".").reduce<unknown>((current, key) => {
    if (
      current &&
      typeof current === "object" &&
      key in (current as Record<string, unknown>)
    ) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, variables);

  return typeof value === "string" ? value : fallback;
}

export function replaceMoustacheVariables(
  variables: Record<string, unknown>,
  value: string,
) {
  let output = value;
  let match: RegExpExecArray | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: This is a false positive.
  while ((match = VARIABLE_REGEX.exec(value)) !== null) {
    if (match.index === VARIABLE_REGEX.lastIndex) {
      VARIABLE_REGEX.lastIndex++;
    }

    const matchedPath = match[1];
    if (!matchedPath) {
      continue;
    }

    output = output.replace(
      match[0],
      getNestedValue(variables, matchedPath, match[0]),
    );
  }

  return output;
}
