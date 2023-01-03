import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const inter = fetch(new URL('../../fonts/Inter-Regular.ttf', import.meta.url)).then(res =>
  res.arrayBuffer(),
);

const interBold = fetch(new URL('../../fonts/Inter-Bold.ttf', import.meta.url)).then(res =>
  res.arrayBuffer(),
);

export default async function handler(req: NextRequest) {
  try {
    const fontData = await Promise.all([inter, interBold]);

    const { searchParams } = new URL(req.url);

    const owner = searchParams.get('owner');
    const repository = searchParams.get('repository');

    if (!owner || !repository) {
      return new ImageResponse(<>Missing required fields.</>, {
        width: 1200,
        height: 630,
      });
    }

    const name = searchParams.get('name');
    const logo = searchParams.get('logo');
    const description = searchParams.get('description');

    return new ImageResponse(
      (
        <div
          tw="flex items-center justify-center flex-col flex-nowrap w-full h-full text-center text-white"
          style={{
            fontFamily: '"Inter"',
            backgroundColor: '#18181C',
          }}
        >
          <div tw="flex mt-32">{!!logo && <img style={{ height: 45 }} src={logo} />}</div>
          <div
            tw="flex font-bold mt-6"
            style={{
              fontSize: 65,
            }}
          >
            {name || `${owner}/${repository}`}
          </div>
          {!!description && (
            <div
              tw="flex mx-auto text-center items-center justify-center mt-2 opacity-75"
              style={{ width: '65%' }}
            >
              {description}
            </div>
          )}
          {!!name && (
            <div tw="flex items-center mt-8 opacity-75">
              <svg fill="white" viewBox="0 0 100 100" style={{ width: 30, height: 30 }}>
                <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
              </svg>
              <div tw="flex items-center ml-3">
                {owner}/{repository}
              </div>
            </div>
          )}
          <div tw="flex text-sm opacity-75 mt-32">Powered by docs.page</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontData[0],
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: fontData[1],
            weight: 700,
            style: 'normal',
          },
        ],
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
