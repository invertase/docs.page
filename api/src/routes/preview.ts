import type { Request, Response } from "express";
import { z } from "zod";
import type { BundlerOutput } from "../bundler";
import { parseMdx } from "../bundler/mdx";
import { parseConfig } from "../config";
import { badRequest, ok, serverError } from "../res";

const PreviewSchema = z.object({
  markdown: z.string().nullable(),
  config: z.object({
    json: z.string().nullable(),
    yaml: z.string().nullable(),
  }),
  components: z.array(z.string()).optional(),
});

export default async function preview(
  req: Request,
  res: Response
): Promise<Response> {
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

    const mdx = await parseMdx(input.data.markdown ?? "", {
      headerDepth: config.content?.headerDepth ?? 3,
      components: input.data.components ?? [],
    });

    const output: BundlerOutput = {
      source: {
        type: "branch",
        owner: "owner",
        repository: "repository",
        ref: "preview",
      },
      private: false,
      ref: "preview",
      stars: 0,
      forks: 0,
      baseBranch: "preview",
      path: "preview",
      config,
      markdown: input.data.markdown ?? "",
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
