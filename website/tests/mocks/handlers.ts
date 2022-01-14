import { fixtures } from './fixtures';

export const handlers = [
  rest.get('http://localhost:8000/bundle', (req, res, ctx) => {
    // const owner = req.params.owner as string;
    // const repository = req.params.repository as '200' | '400' | '404' | '500';
    const owner = req.url.searchParams.get('owner');
    if (owner === '_test') {
      const repository = req.url.searchParams.get('repository') as unknown as
        | '200'
        | '400'
        | '404'
        | '500';

      return res(ctx.status(parseInt(repository)), ctx.json(fixtures[repository]));
    }
  }),
];
