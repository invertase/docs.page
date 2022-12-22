import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function (_req: Request) {
  return new ImageResponse(
    {
      key: 'docs-page-og',
      type: 'div',
      props: {
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'p',
                  props: {
                    style: { fontSize: 32 },
                    children: 'Docs.Page',
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: { fontSize: 64 },
                    children: 'Title',
                  },
                },
              ],
            },
          },
        ],
        style: {
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        },
      },
    },
    {
      width: 1200,
      height: 600,
    },
  );
}
