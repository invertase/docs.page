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
    return new Response('Missing owner or repository', { status: 400 });
  }

  const name = params.get('logo');
  const logo = params.get('logo');
  const description = params.get('description');

  return new ImageResponse(
    {
      key: 'docs-page-og',
      type: 'div',
      props: {
        style: {
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: '80%',
                display: 'flex',
                textAlign: 'center',
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: 'https://static.invertase.io/assets/docs.page/docs-page-logo.png',
                    style: { height: 30 },
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: { fontSize: 32 },
                    children: `${owner}/${repository}`,
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: { fontSize: 64 },
                    children: 'Melos',
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: { fontSize: 64 },
                    children: 'Some description about melos',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 600,
    },
  );
}
