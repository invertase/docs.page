import type { Request, Response } from 'express';
import { z } from 'zod';
import { ok, badRequest, serverError } from '../res';
import { parseMdx } from '../bundler/mdx';
import { parseConfig } from '../config';
import type { BundlerOutput } from '../bundler';

const PreviewSchema = z.object({
  markdown: z.string().nullable(),
  config: z.object({
    json: z.string().nullable(),
    yaml: z.string().nullable(),
  }),
});

export default async function preview(req: Request, res: Response): Promise<Response> {
  const input = PreviewSchema.safeParse(JSON.parse(req.body));

  if (!input.success) {
    console.error(input.error);
    return badRequest(res, input.error);
  }

  try {
    const config = parseConfig({
      json: input.data.config.json ?? undefined,
      yaml: input.data.config.yaml ?? undefined,
    });

    const mdx = await parseMdx(input.data.markdown ?? '', {
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
      stars: 0,
      forks: 0,
      baseBranch: 'preview',
      path: 'preview',
      config,
      markdown: input.data.markdown ?? '',
      headings: mdx.headings,
      frontmatter: mdx.frontmatter,
      code: mdx.code,
    };

    return ok(res, output);
  } catch (e: unknown) {
    console.error(e);
    return serverError(res, e);
  }
}
