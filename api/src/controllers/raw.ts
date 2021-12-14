import { bundle } from "../utils/bundler.js";

import { Request, Response } from "express";
import { getPlugins } from "../utils/pluginMap.js";
import { toArray } from "../utils/array.js";

/**
 * Gets the API information.
 *
 * @param {Request} req
 * @param {Response} res
 */
export const bundleRaw = async (req: Request, res: Response) => {
  //
  // parse query params:
  const remarkPluginsNames = req?.query?.remarkPlugins
    ? toArray(req?.query?.remarkPlugins as string)
    : null;
  const rehypePluginsNames = req?.query?.remarkPlugins
    ? toArray(req?.query?.remarkPlugins as string)
    : null;
  const headerDepth = req?.query?.headerDepth
    ? parseInt(req?.query?.headerDepth as string)
    : null;
  //
  // get plugins for mdx-bundler:
  const remarkPlugins = getPlugins(remarkPluginsNames);
  const rehypePlugins = getPlugins(rehypePluginsNames);
  if (req.body !== undefined) {
    const result = await bundle(req.body, {
      remarkPlugins,
      rehypePlugins,
      headerDepth,
    });

    return res.json(result);
  }
  return res.status(404).send("Please include a body of markdown");
};
