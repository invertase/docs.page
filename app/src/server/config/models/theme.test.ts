import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// `@/lib/fonts` (next/font/google) only loads inside the Next.js bundler, so
// read the font declarations from the source instead. `theme.ts` maps each
// preset font key to `var(--font-${key})`, so every font must declare that
// variable.
const source = readFileSync(
  join(import.meta.dir, "../../../lib/fonts.ts"),
  "utf8",
);

// `const geistSans = Geist({ ..., variable: "--font-geist" })`
const declaredVariables = new Map(
  [...source.matchAll(/const (\w+) = \w+\(\{[^}]*?variable: "([^"]+)"/g)].map(
    ([, name, variable]) => [name, variable],
  ),
);

// `export const fonts = { geist: geistSans, "noto-sans": notoSans, ... }`
const fontsBlock = source.match(/export const fonts = \{([^}]*)\}/)?.[1] ?? "";
const presetFonts = [...fontsBlock.matchAll(/^\s*"?([\w-]+)"?: (\w+),$/gm)].map(
  ([, key, name]) => ({ key, name }),
);

describe("theme preset font mapping", () => {
  test("parses the font declarations", () => {
    expect(presetFonts.length).toBeGreaterThan(0);
    expect(presetFonts.length).toBe(declaredVariables.size);
  });

  test.each(presetFonts)("$key resolves to a defined CSS variable", ({
    key,
    name,
  }) => {
    expect(declaredVariables.get(name)).toBe(`--font-${key}`);
  });
});
