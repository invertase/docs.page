import { z } from "zod";
import { presetToShadcnThemeCss } from "shadcn-presets";
import { fonts } from "@/lib/fonts";

const mapping = Object.fromEntries(
  Object.entries(fonts).map(([key, value]) => [key, `var(--font-${key})`]),
);

const hexColor = z
  .string()
  .optional()
  .transform((value) => {
    if (!value || !/^#?[0-9A-Fa-f]{6}$/.test(value)) {
      return undefined;
    }

    return value;
  });

const shadcnPreset = z
  .string()
  .optional()
  .transform((value) => {
    return value ? presetToShadcnThemeCss(value, mapping) ?? undefined : undefined;
  });

export default z
  .object({
    defaultTheme: z
      .union([z.literal("light"), z.literal("dark")])
      .optional()
      .catch(undefined),
    preset: shadcnPreset,
    primary: hexColor,
    primaryLight: hexColor,
    primaryDark: hexColor,
    backgroundLight: hexColor,
    backgroundDark: hexColor,
  })
  .catch({
    defaultTheme: undefined,
    preset: undefined,
    primary: undefined,
    primaryLight: undefined,
    primaryDark: undefined,
    backgroundLight: undefined,
    backgroundDark: undefined,
  });
