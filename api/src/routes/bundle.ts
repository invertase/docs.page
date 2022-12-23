import { Request, Response } from 'express';
import { z } from 'zod';
import { ok, badRequest, serverError, response } from '../res.js';
import bundler, { ERROR_CODES } from '../bundler/index.js';

const $input = z.object({
  owner: z
    .string({
      required_error: 'Missing owner parameter.',
      invalid_type_error: 'Owner parameter must be a string.',
    })
    .min(1),
  repository: z
    .string({
      required_error: 'Missing repository parameter.',
      invalid_type_error: 'Repository parameter must be a string.',
    })
    .min(1),
  ref: z.string().optional(),
  path: z.string().optional().default('index'),
});

export default async function bundle(req: Request, res: Response): Promise<Response> {
  const input = $input.safeParse(req.query);

  if (!input.success) {
    return badRequest(res, input.error);
  }

  try {
    return ok(res, await bundler(input.data));
  } catch (e: unknown) {
    if (e === ERROR_CODES.REPO_NOT_FOUND) {
      return response(res, 404, 'REPO_NOT_FOUND', {
        error: `The repository ${input.data.owner}/${input.data.repository} was not found.`,
      });
    }

    if (e === ERROR_CODES.FILE_NOT_FOUND) {
      return response(res, 404, 'FILE_NOT_FOUND', {
        error: `The file "/docs/${input.data.path}.mdx" or "/docs/${input.data.path}/index.mdx" in repository ${input.data.owner}/${input.data.repository} was not found.`,
      });
    }

    if (e === ERROR_CODES.BUNDLE_ERROR) {
      return response(res, 500, 'BUNDLE_ERROR', {
        error: 'Something went wrong while bundling the file. Are you sure the MDX is valid?',
      });
    }

    return serverError(res, e);
  }
}
