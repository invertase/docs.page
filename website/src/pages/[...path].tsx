import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { BundleErrorResponse } from "~/api";
import { type Context, getRequestContext } from "~/context";
import type { SharedEnvironmentVariables } from "~/env";

import { Documentation } from "~/layouts/Documentation";
import { Error } from "~/layouts/Error";
import { Site } from "~/layouts/Site";
import { Redirect, bundleCodeToStatusCode } from "~/utils";

export const getServerSideProps = (async ({ params, req, res }) => {
  const env = {
    VERCEL: process.env.VERCEL || null,
    VERCEL_ENV: process.env.VERCEL_ENV || null,
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || null,
  } satisfies SharedEnvironmentVariables;

  const param = params?.path ? params.path : [];
  const chunks = Array.isArray(param) ? param : [param];

  // Any paths with only one chunk are invalid, and should be handled
  // by other page routes.
  if (chunks.length === 1) {
    return { notFound: true };
  }

  // Any paths with two chunks or more are a repository page.
  let [owner, repository, ...path] = chunks;
  let ref: string | undefined;

  // Check if the repo includes a ref (invertase/foo~bar)
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
    // If error is a Redirect instance
    if (error instanceof Redirect) {
      return {
        redirect: {
          destination: error.url,
          permanent: false,
        },
      };
    }

    // If error is a Response instance
    if (error instanceof Response) {
      // Parse the response body as JSON.
      const body = (await error.json()) as BundleErrorResponse;

      // Set the status code to the bundle error code.
      res.statusCode = bundleCodeToStatusCode(body);

      return {
        props: {
          error: body,
        },
      };
    }

    throw error;
  }

  // Cache the response for 1 second, and revalidate in the background.
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1, stale-while-revalidate=59"
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
  // If there is an error, render the error page.
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
