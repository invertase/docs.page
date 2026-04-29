import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { BundleErrorResponse } from "~/api";
import { type Context, getRequestContext } from "~/context";
import type { SharedEnvironmentVariables } from "~/env";

import { Documentation } from "~/layouts/Documentation";
import { Error } from "~/layouts/Error";
import { Site } from "~/layouts/Site";
import { bundleCodeToStatusCode, Redirect } from "~/utils";

export const getServerSideProps = (async ({ params, req, res }) => {
  const env = {
    VERCEL: process.env.VERCEL || null,
    VERCEL_ENV: process.env.VERCEL_ENV || null,
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || null,
  } satisfies SharedEnvironmentVariables;

  const param = params?.path ? params.path : [];
  const chunks = Array.isArray(param) ? param : [param];

  // `/` is `pages/index.tsx` (marketing homepage, no bundler).
  // Doc URLs need at least `owner` and `repository` (e.g. /invertase/docs.page/...).
  if (chunks.length < 2) {
    return { notFound: true };
  }

  let [owner, repository, ...path] = chunks;
  let ref: string | undefined;

  if (repository.includes("~")) {
    [repository, ref] = repository.split("~");
  }

  let ctx: Context | null = null;

  try {
    ctx = await getRequestContext(req, {
      owner,
      repository,
      ref,
      path: path.join("/"),
    });
  } catch (error) {
    if (error instanceof Redirect) {
      return {
        redirect: {
          destination: error.url,
          permanent: false,
        },
      };
    }

    if (error instanceof Response) {
      const body = (await error.json()) as BundleErrorResponse;

      res.statusCode = bundleCodeToStatusCode(body);

      return {
        props: {
          error: body,
        },
      };
    }

    throw error;
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1, stale-while-revalidate=59",
  );

  return { props: { env, ctx } };
}) satisfies GetServerSideProps<
  | {
      env: SharedEnvironmentVariables;
      ctx: Context;
    }
  | {
      error: BundleErrorResponse;
    }
>;

export default function Route({
  env,
  ctx,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (error) {
    return (
      <Site>
        <Error error={error} />
      </Site>
    );
  }

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${env ? JSON.stringify(env) : "{}"}`,
        }}
      />
      <Documentation ctx={ctx} />
    </>
  );
}
