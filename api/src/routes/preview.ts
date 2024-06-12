import type { Request, Response } from 'express';
import { z } from 'zod';
import { ok, badRequest, serverError } from '../res';
import { parseMdx } from '../bundler/mdx';
import { parseConfig } from '../config';
import type { BundlerOutput } from '../bundler';

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

    const mdx = await parseMdx(input.data.markdown, {
      headerDepth: config.content?.headerDepth ?? 3,
    });

    const output: BundlerOutput = {
      source: {
        type: 'branch',
        owner: 'owner',
        repository: 'repository',
        ref: 'preview',
      },
      ref: 'preview',
      baseBranch: 'preview',
      path: 'preview',
      config,
      markdown: input.data.markdown,
      headings: mdx.headings,
      frontmatter: mdx.frontmatter,
      code: mdx.code,
    };

    return ok(res, output);
  } catch (e: unknown) {
    return serverError(res, e);
  }
}
