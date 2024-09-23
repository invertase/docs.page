import type { NextApiRequest, NextApiResponse } from "next";
import {
  type BundleErrorResponse,
  type BundlerOutput,
  getPreviewBundle,
} from "~/api";

type ResponseData = {
  bundle: BundlerOutput;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405);
  }

  const bundle = await getPreviewBundle(JSON.parse(req.body));

  res.status(200).json({
    bundle,
  });
}
