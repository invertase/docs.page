/** Public path prefix for the 2026 landing-page asset bundle. */
export const LANDING_ASSETS_BASE =
  "/_docs.page/assets/docs.page-update-2026" as const;

export function landingAssetPath(filename: string): string {
  return `${LANDING_ASSETS_BASE}/${filename}`;
}
