import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const owner = searchParams.get('owner');
    const repository = searchParams.get('repository');

    if (!owner || !repository) {
      return new ImageResponse(<>Missing required fields.</>, {
        width: 1200,
        height: 630,
      });
    }

    // const repository = searchParams.get('repository');

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'black',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              color: 'white',
              fontSize: 70,
            }}
          >
            {owner}/{repository}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
