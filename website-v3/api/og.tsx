import { ImageResponse } from '@vercel/og';

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

  return new ImageResponse(
    <div tw="w-full h-full flex flex-col items-center justify-center bg-white">Hello world!</div>,
    {
      width: 1200,
      height: 600,
    },
  );
}
