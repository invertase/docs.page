import { z } from 'zod';
import type { BundleResponse } from '../../api/src/types.ts';
export type { BundleResponse, BundlerOutput } from '../../api/src/types.ts';

const GetBundleSchema = z.object({
  owner: z.string(),
  repository: z.string(),
  ref: z.string().optional(),
  path: z.string().optional(),
});

// const $ApiError = z.object({
//   code: z.enum(['NOT_FOUND', 'BAD_REQUEST', 'REPO_NOT_FOUND', 'FILE_NOT_FOUND', 'BUNDLE_ERROR']),
//   error: $GetBundleResponseError,
// });

// const $GetPreviewRequest = z.object({
//   config: z.object({
//     json: z.string().optional(),
//     yaml: z.string().optional(),
//   }),
//   markdown: z.string(),
// });

// const $GetPreviewResponse = z.union([
//   z.object({
//     code: z.literal('OK'),
//     data: $GetPreviewResponseSuccess,
//   }),
//   $ApiError,
// ]);

// export type GetBundleRequest = z.infer<typeof $GetBundleRequest>;
// export type GetBundleResponse = z.infer<typeof $GetBundleResponse>;

export async function getBundle(options: z.infer<typeof GetBundleSchema>): Promise<BundleResponse> {
  // Validate the input
  GetBundleSchema.parse(options);

  if (import.meta.env.NODE_ENV == 'production' && !import.meta.env.API_PASSWORD) {
    throw new Error('Please provide API_PASSWORD env variable');
  }

  const endpoint = getEndpoint(options);

  return fetch(endpoint, {
    headers: new Headers({
      Authorization:
        'Bearer ' + Buffer.from(`admin:${import.meta.env.API_PASSWORD}`).toString('base64'),
    }),
  }).then(res => res.json());
}

// export async function getPreview(options: GetPreviewRequest): Promise<GetPreviewResponse> {
//   $GetPreviewRequest.parse(options);

//   if (import.meta.env.NODE_ENV == 'production' && !import.meta.env.API_PASSWORD) {
//     throw new Error('Please provide API_PASSWORD env variable');
//   }

//   const endpoint = getPreviewEndpoint();
//   const encoder = new TextEncoder();
//   const encodedData = encoder.encode(`admin:${import.meta.env.API_PASSWORD}`);
//   const response = await fetch(`${endpoint}/preview`, {
//     method: 'POST',
//     body: JSON.stringify(options),
//     headers: new Headers({
//       Authorization: 'Bearer ' + encodedData,
//     }),
//   });

//   const output = $GetPreviewResponse.safeParse(await response.json());

//   if (!output.success) {
//     throw new Error(`Failed to fetch bundle for "${endpoint}". HTTP Status: "${response.status}".`);
//   }

//   return output.data;
// }

// function getPreviewEndpoint(): string {
//   const base =
//     import.meta.env.BUNDLER_URL || import.meta.env.PROD
//       ? import.meta.env.BUNDLER_URL || `https://api.docs.page`
//       : 'http://localhost:8080';

//   return base;
// }

// Utility function to create the endpoint to fetch the bundle from.
function getEndpoint(options: z.infer<typeof GetBundleSchema>): string {
  const params = new URLSearchParams({
    owner: options.owner,
    repository: options.repository,
  });

  if (options.path) params.append('path', options.path);
  if (options.ref) params.append('ref', options.ref);

  const base =
    import.meta.env.BUNDLER_URL || import.meta.env.PROD
      ? import.meta.env.BUNDLER_URL || `https://api.docs.page`
      : 'http://localhost:8080';

  return `${base}/bundle?${params.toString()}`;
}
