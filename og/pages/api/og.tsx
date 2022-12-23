import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function (req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const owner = params.get('owner');
  const repository = params.get('repository');

  if (!owner || !repository) {
    return new Response('Missing owner or repository', {
      status: 400,
    });
  }

  const logo = params.get('logo');
  const name = params.get('name');
  const description = params.get('description');

  return new ImageResponse(
    <div tw="h-full w-full flex flex-col items-center justify-center bg-gray-50">
      <img src={logo!} tw="w-16 h-16"  />
      <div>{owner}/{repository}</div>
      <div>{name}</div>
      <div>{description}</div>
    </div>,
    {
      width: 1200,
      height: 600,
    },
  );
}
