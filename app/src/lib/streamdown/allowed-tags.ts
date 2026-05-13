import { DOC_FENCED_TAG_CONFIGS } from "@/lib/streamdown/doc-fenced-components";

/**
 * Structural allowlist entries that are not part of the fenced registry
 * (unknown-component wrapper div uses `data*` only).
 */
const DOC_STREAMDOWN_INTRINSIC_TAGS = {
  div: ["data*"],
} as const;

function buildDocStreamdownAllowedTags(): Record<string, string[]> {
  const merged: Record<string, string[]> = {
    div: [...DOC_STREAMDOWN_INTRINSIC_TAGS.div],
  };
  for (const cfg of DOC_FENCED_TAG_CONFIGS) {
    merged[cfg.tag] = [...cfg.attrs];
  }
  return merged;
}

/** Sanitize allowlist for Streamdown (`allowedTags`) + unwrap custom blocks. */
export const DOC_STREAMDOWN_ALLOWED_TAGS = buildDocStreamdownAllowedTags();

export const DOC_CUSTOM_BLOCK_TAGS = new Set(
  Object.keys(DOC_STREAMDOWN_ALLOWED_TAGS),
);
