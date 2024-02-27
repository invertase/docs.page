import { Request, Response } from 'express';
import { z } from 'zod';
import { ok, badRequest, serverError, response } from '../res';
import bundler, { BundlerError } from '../bundler/index';

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
    if (e instanceof BundlerError) {
      return response(res, e.code, e.name, {
        // error will return an string with the error message and the cause
        // in client side we can parse the error and show the message and the cause
        error: JSON.stringify({
          message: e.message,
          cause: e.cause,
        }),
      });
    }
    return serverError(res, e);
  }
}
