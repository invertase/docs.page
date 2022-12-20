import type { APIRoute } from 'astro';
import { z } from 'zod';
import cookie from 'cookie';

const $Request = z.object({
  owner: z.string(),
  repository: z.string(),
  ref: z.string().optional(),
  domain: z.string().optional(),
  groupId: z.string(),
  buttonId: z.string(),
});

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

export const post: APIRoute = async function ({ request }) {
  try {
    const { owner, repository, ref, domain, groupId, buttonId } = $Request.parse(
      await request.json(),
    );
    const { tabs } = cookie.parse(request.headers.get('cookie') ?? '');

    const getPath = () => {
      // Set to the root for domains.
      if (domain) {
        return '/';
      }

      let path = `/${owner}/${repository}`;
      if (ref) path += `~${encodeURIComponent(ref)}`;
      return path;
    };

    // Set an expiry for 10 years
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 10);

    const existing = safeJsonParse(tabs ?? `{}`);
    existing[groupId] = buttonId;

    return new Response(null, {
      status: 200,
      headers: new Headers({
        'Set-Cookie': cookie.serialize('tabs', JSON.stringify(existing), {
          expires: expires,
          // If its a domain, set the cookie to the root path, otherwise set it to the owner/repository
          path: getPath(),
          // The cookie needs to be sent to the server to merge.
          httpOnly: false,
        }),
      }),
    });
  } catch (e) {
    console.error(e);
    return new Response(null, {
      status: 400,
    });
  }
};
