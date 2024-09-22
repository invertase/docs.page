import { getRequestContext } from "@/context";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useEffect } from "react";

export const getServerSideProps = (async ({ params, req }) => {
  const param = params?.path ? params.path : [];
  const chunks = Array.isArray(param) ? param : [param];

  // No chunks is the homepage.
  if (chunks.length === 0) {
    return { props: {} };
  }

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

  try {
    await getRequestContext(req, {
      owner,
      repository,
      ref,
      vanity: false,
    });
  } catch (e) {}

  console.log(chunks);
  return { props: { ctx: "hello" } };
}) satisfies GetServerSideProps<{ ctx?: string }>;

export default function Route({
  ctx,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!ctx) {
    return <Homepage />;
  }

  return <Docs />;
}

function Homepage() {
  return <div>Homepage</div>;
}

function Docs() {
  useEffect(() => {
    console.log("Docs mounted");
  }, []);

  return <div>Docs</div>;
}
