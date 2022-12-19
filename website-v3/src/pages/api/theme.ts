import type { APIRoute } from 'astro';
import { z } from 'zod';
import cookie from 'cookie';

const $Request = z.object({
  owner: z.string(),
  repository: z.string(),
  ref: z.string().optional(),
  domain: z.string().optional(),
  theme: z.enum(['dark', 'light']),
});

export const post: APIRoute = async function ({ request }) {
  try {
    const { owner, repository, ref, domain, theme } = $Request.parse(await request.json());

    // Set an expiry for 10 years
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 10);

    const getPath = () => {
      // Set to the root for domains.
      if (domain) {
        return '/';
      }

      let path = `/${owner}/${repository}`;
      if (ref) path += `~${encodeURIComponent(ref)}`;
      return path;
    };

    return new Response(null, {
      status: 200,
      headers: new Headers({
        'Set-Cookie': cookie.serialize('theme', theme, {
          expires: expires,
          // If its a domain, set the cookie to the root path, otherwise set it to the owner/repository
          path: getPath(),
        }),
      }),
    });
  } catch {
    return new Response(null, {
      status: 400,
    });
  }
};
