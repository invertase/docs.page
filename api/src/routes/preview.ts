import { Request, Response } from 'express';
import { z } from 'zod';
import { ok, badRequest, serverError } from '../res';
import { bundle } from '../bundler/mdx';
import parseConfig from '../utils/config';

const $input = z.object({
  markdown: z.string(),
  config: z.object({
    json: z.string().optional(),
    yaml: z.string().optional(),
  }),
});

export default async function preview(req: Request, res: Response): Promise<Response> {
  const input = $input.safeParse(JSON.parse(req.body));

  if (!input.success) {
    return badRequest(res, input.error);
  }

  try {
    const config = parseConfig({
      json: input.data.config.json,
      yaml: input.data.config.yaml,
    });

    const mdx = await bundle(input.data.markdown, {
      headerDepth: config.headerDepth,
    });

    return ok(res, {
      config,
      headings: mdx.headings,
      frontmatter: mdx.frontmatter,
      code: mdx.code,
    });
  } catch (e: unknown) {
    return serverError(res, e);
  }
}
