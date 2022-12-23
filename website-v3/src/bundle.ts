import { z } from 'zod';
import querystring from 'querystring';

const $SidebarItem = z.tuple([z.string(), z.string()]);

const $BundleConfig = z.object({
  name: z.string(),
  logo: z.string(),
  logoDark: z.string(),
  favicon: z.string(),
  socialPreview: z.string(),
  twitter: z.string(),
  noindex: z.boolean(),
  theme: z.string(),
  docsearch: z
    .object({
      appId: z.string(),
      apiKey: z.string(),
      indexName: z.string(),
    })
    .optional(),
  sidebar: z.array(z.tuple([z.string(), z.union([z.string(), z.array($SidebarItem)])])).optional(),
  headerDepth: z.number(),
  variables: z.record(z.any()).optional(),
  googleTagManager: z.string(),
  googleAnalytics: z.string(),
  zoomImages: z.boolean(),
  experimentalCodehike: z.boolean(),
  experimentalMath: z.boolean(),
  automaticallyInferNextPrevious: z.boolean(),
  plausibleAnalytics: z.boolean().optional(),
});

const $GetBundleRequest = z.object({
  owner: z.string(),
  repository: z.string(),
  ref: z.string().optional(),
  path: z.string().optional(),
});

const $GetBundleResponseError = z.object({
  statusCode: z.number(),
  message: z.string(),
  reason: z.enum([
    'REPO_NOT_FOUND',
    'BUNDLE_ERROR',
    'REF_NOT_FOUND',
    'BAD_CONFIG',
    'MISSING_CONFIG',
    'FILE_NOT_FOUND',
  ]),
});

const $GetBundleResponseSuccess = z.object({
  code: z.string(),
  config: $BundleConfig,
  frontmatter: z.record(z.string()),
  headings: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        rank: z.number().nullable(),
      }),
    )
    .nullable(),
  baseBranch: z.string(),
  path: z.string().nullable(),
  repositoryFound: z.boolean(),
  source: z.object({
    type: z.enum(['PR', 'branch', 'commit']),
    owner: z.string(),
    repository: z.string(),
    ref: z.string(),
  }),
});

const $GetBundleResponse = z.object({
  status: z.number(),
  bundle: z.union([$GetBundleResponseError, $GetBundleResponseSuccess]),
});

export type GetBundleRequest = z.infer<typeof $GetBundleRequest>;
export type GetBundleResponse = z.infer<typeof $GetBundleResponse>;
export type GetBundleResponseError = z.infer<typeof $GetBundleResponseError>;
export type GetBundleResponseSuccess = z.infer<typeof $GetBundleResponseSuccess>;

export type BundleConfig = z.infer<typeof $BundleConfig>;

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

  // These are valid JSON responses from the server.
  if ([200, 404, 400].includes(response.status)) {
    return $GetBundleResponse.parse({
      status: response.status,
      bundle: await response.json(),
    });
  }

  throw new Error(`Failed to fetch bundle for "${endpoint}". HTTP Status: "${response.status}".`);
}

function getEndpoint(options: GetBundleRequest): string {
  const params: Record<string, string> = {
    owner: options.owner,
    repository: options.repository,
  };

  if (options.path) params['path'] = options.path;
  if (options.ref) params['ref'] = options.ref;

  const base =
    import.meta.env.BUNDLER_URL || import.meta.env.PROD
      ? `https://api.docs.page`
      : 'http://localhost:8000';

  if (import.meta.env.K_REVISION) params['_k_revision'] = import.meta.env.K_REVISION;

  // TODO: querystring is deprecated
  return `${base}/bundle?${querystring.stringify(params)}`;
}
