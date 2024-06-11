import type { Request, Response } from 'express';
import { z } from 'zod';
import { ok, badRequest, serverError } from '../res';
import { bundle } from '../bundler/mdx';

const $input = z.object({
  markdown: z.string(),
});

export default async function mdx(req: Request, res: Response): Promise<Response> {
  const input = $input.safeParse(req.body);

  if (!input.success) {
    return badRequest(res, input.error);
  }

  try {
    const response = await bundle(input.data.markdown, {
      headerDepth: 3,
    });
    return ok(res, response);
  } catch (e: unknown) {
    return serverError(res, e);
  }
}
