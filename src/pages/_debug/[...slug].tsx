import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Error from "next/error";
import Head from "next/head";
import A2A from "a2a";

// TODO type definitions
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";

export default function Debug({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  return (
    <>
      <section className="mx-auto mt-20 max-w-3xl border rounded font-mono divide-y">
        <div className="flex p-3">
          <div className="flex-1">Owner</div>
          <div>invertase</div>
        </div>
        <div className="flex p-3">
          <div className="flex-1">Repository</div>
          <div>melos</div>
        </div>
        <div className="flex p-3">
          <div className="flex-1">Ref (branch)</div>
          <div>docs-testing</div>
        </div>
        <div className="flex p-3">
          <div className="flex-1">Config</div>
          <div>docs.yaml</div>
        </div>
      </section>
      <section className="mx-auto mt-10 max-w-5xl border rounded font-mono">
        <div className="flex divide-x">
          <div className="flex-1 p-4">
            <pre>Config Input</pre>
          </div>
          <div className="flex-1 p-4">
            <pre>Out</pre>
          </div>
        </div>
      </section>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

type StaticProps = {};

export const getStaticProps: GetStaticProps<StaticProps> = async ({
  params,
}) => {
  return {
    props: {},
    revalidate: 5,
  };
};
