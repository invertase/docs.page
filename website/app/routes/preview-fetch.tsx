import { ActionFunction } from 'remix';

export const action: ActionFunction = async ({ request }) => {
  const token = Buffer.from(`admin:${process.env.API_PASSWORD}`).toString('base64');
  const rawEndpoint =
    process.env.NODE_ENV === 'production'
      ? 'https://api.docs.page/raw'
      : 'http://localhost:8000/raw';
  const body = await request.text();

  switch (request.method) {
    case 'POST': {
      return await fetch(rawEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body,
      });
    }
  }
};
