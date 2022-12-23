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
    <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <div tw="bg-gray-50 flex">
          <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
            <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
              <span>{owner}/{repository}</span>
              <span tw="text-indigo-600">{description}</span>
            </h2>
          </div>
        </div>
      </div>,
    {
      width: 1200,
      height: 600,
    },
  );
}
