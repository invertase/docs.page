type GetBundleArgs = {
  owner: string;
  repository: string;
  ref?: string;
  path?: string;
};

const PRODUCTION = process.env.NODE_ENV === 'production';
const API_PASSWORD = process.env.API_PASSWORD;
const BUNDLER_URL =
  process.env.BUNDLER_URL || (PRODUCTION ? 'https://api.docs.page' : 'http://localhost:8080');

export async function getBundle(args: GetBundleArgs) {
  const params = new URLSearchParams({
    owner: args.owner,
    repository: args.repository,
  });

  if (args.path) params.append('path', args.path);
  if (args.ref) params.append('ref', args.ref);
  console.log(`${BUNDLER_URL}/bundle?${params.toString()}`);
  // Fetch the bundle from the bundler.
  const response = await fetch(`${BUNDLER_URL}/bundle?${params.toString()}`, {
    headers: new Headers({
      Authorization: `Bearer ${Buffer.from(`admin:${API_PASSWORD}`).toString('base64')}`,
    }),
  });

  const json = await response.json();

  if (response.ok) {
    return json.data;
  }

  throw new Error('Failed to fetch bundle');
}
