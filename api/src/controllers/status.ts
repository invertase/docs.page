import { Request, Response } from 'express';

/**
 * Gets the API information.
 *
 * @param {Request} req
 * @param {Response} res
 */
export const bundleRaw = async (req: Request, res: Response) => {
  return res.status(200).send('OK');
};
