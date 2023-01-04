import { z } from 'zod';

const $SidebarItem = z.tuple([
  z.string(),
  z.union([z.string(), z.array(z.tuple([z.string(), z.string()]))]),
]);

const $SidebarArray = z.array($SidebarItem);
const $SidebarRecord = z.record(z.array($SidebarItem));

const $BundleConfig = z.object({
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  logoDark: z.string(),
  favicon: z.string(),
  socialPreview: z.string(),
  twitter: z.string(),
  noindex: z.boolean(),
  theme: z.string(),
  anchors: z.array(
    z.object({
      icon: z.string(),
      title: z.string(),
      link: z.string(),
    }),
  ),
  docsearch: z
    .object({
      appId: z.string(),
      apiKey: z.string(),
      indexName: z.string(),
    })
    .optional(),
  sidebar: z.union([$SidebarArray, $SidebarRecord]),
  locales: z.array(z.string()),
  headerDepth: z.number(),
  variables: z.record(z.any()),
  googleTagManager: z.string(),
  googleAnalytics: z.string(),
  zoomImages: z.boolean(),
  experimentalCodehike: z.boolean(),
  experimentalMath: z.boolean(),
  automaticallyInferNextPrevious: z.boolean(),
  automaticallyDisplayName: z.boolean(),
  plausibleAnalytics: z.boolean(),
  plausibleAnalyticsScript: z.string(),
});

const $GetBundleRequest = z.object({
  owner: z.string(),
  repository: z.string(),
  ref: z.string().optional(),
  path: z.string().optional(),
});

const $GetBundleResponseSuccess = z.object({
  source: z.object({
    type: z.enum(['PR', 'branch', 'commit']),
    owner: z.string(),
    repository: z.string(),
    ref: z.string(),
  }),
  ref: z.string(),
  baseBranch: z.string(),
  path: z.string(),
  config: $BundleConfig,
  notices: z.array(z.string()),
  markdown: z.string(),
  code: z.string(),
  frontmatter: z.record(z.string()),
  headings: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      rank: z.number().nullable(),
    }),
  ),
});

const $GetBundleResponse = z.union([
  z.object({
    code: z.literal('OK'),
    data: $GetBundleResponseSuccess,
  }),
  z.object({
    code: z.enum(['NOT_FOUND', 'BAD_REQUEST', 'REPO_NOT_FOUND', 'FILE_NOT_FOUND', 'BUNDLE_ERROR']),
    error: z.string().catch(''),
  }),
]);

export type GetBundleRequest = z.infer<typeof $GetBundleRequest>;
export type GetBundleResponse = z.infer<typeof $GetBundleResponse>;
export type GetBundleResponseSuccess = z.infer<typeof $GetBundleResponseSuccess>;

export type BundleConfig = z.infer<typeof $BundleConfig>;
export type SidebarArray = z.infer<typeof $SidebarArray>;
export type SidebarRecord = z.infer<typeof $SidebarRecord>;

export async function getBundle(options: GetBundleRequest): Promise<GetBundleResponse> {
  // Validate the input
  $GetBundleRequest.parse(options);

  if (import.meta.env.NODE_ENV == 'production' && !import.meta.env.API_PASSWORD) {
    throw new Error('Please provide API_PASSWORD env variable');
  }

  const endpoint = getEndpoint(options);

  const response = await fetch(endpoint, {
    headers: new Headers({
      Authorization:
        'Bearer ' + Buffer.from(`admin:${import.meta.env.API_PASSWORD}`).toString('base64'),
    }),
  });

  const output = $GetBundleResponse.safeParse(await response.json());

  if (!output.success) {
    throw new Error(`Failed to fetch bundle for "${endpoint}". HTTP Status: "${response.status}".`);
  }

  return output.data;
}

function getEndpoint(options: GetBundleRequest): string {
  const params = new URLSearchParams({
    owner: options.owner,
    repository: options.repository,
  });

  if (options.path) params.append('path', options.path);
  if (options.ref) params.append('ref', options.ref);

  const base =
    import.meta.env.BUNDLER_URL || import.meta.env.PROD
      ? import.meta.env.BUNDLER_URL || `https://api.docs.page`
      : 'http://localhost:8000';

  return `${base}/bundle?${params.toString()}`;
}
