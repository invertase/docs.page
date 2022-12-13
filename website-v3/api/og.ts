import { ImageResponse } from '@vercel/og';
import { OgComponent } from './OgComponent';

// Note; this API route is deployed to Vercel separatly from Astro since it
// needs to run on the edge.

export const config = {
  runtime: 'experimental-edge',
};

export default function handler(req: Request) {
  const params = new URL(req.url).searchParams;

  const owner = params.get('owner');
  const repository = params.get('repository');

  if (!owner || !repository) {
    return new Response('Missing required "owner" & "repository" parameters', { status: 400 });
  }

  const domain = params.get('domain');
  const logo = params.get('logo');

  return new ImageResponse(OgComponent({ owner, repository }), {
    width: 1200,
    height: 600,
  });
}
