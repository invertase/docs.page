import type { ReactNode } from "react";
import type { BundleErrorResponse } from "./api";

const CODE_MAP: Record<BundleErrorResponse["code"], string> = {
  NOT_FOUND: "Page not found",
  BAD_REQUEST: "Something went wrong",
  REPO_NOT_FOUND: "Repository not found",
  FILE_NOT_FOUND: "File not found",
  BUNDLE_ERROR: "Something went wrong",
  INTERNAL_SERVER_ERROR: "Something went wrong",
};

type Props =
  | {
      title: string;
      description: string;
    }
  | {
      error: BundleErrorResponse;
    };

export function ErrorLayout(props: Props) {
  // If an error is thrown from the bundler, we can render
  // specific error messages based on the error code.
  if ("error" in props) {
    return (
      <View
        title={CODE_MAP[props.error.code]}
        description={
          typeof props.error.error === "string" ? (
            props.error.error
          ) : (
            <span
              dangerouslySetInnerHTML={{ __html: props.error.error.message }}
            />
          )
        }
        source={
          typeof props.error.error !== "string"
            ? props.error.error.source
            : undefined
        }
      />
    );
  }

  // Otherwise it's just a generic error, e.g. 404.
  return <View {...props} />;
}

type ViewProps = {
  title: string;
  description: ReactNode;
  source?: string;
};

function View(props: ViewProps) {
  return (
    <div
      className="fixed top-[50%] left-[50%]"
      style={{
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="text-center space-y-5 max-w-2xl">
        <h1 className="font-display text-4xl md:text-5xl">{props.title}</h1>
        <p>{props.description}</p>
        {props.source ? (
          <a href={props.source} className="inline-block hover:underline">
            Go to repository &rarr;
          </a>
        ) : (
          <a href="/" className="inline-block hover:underline">
            Back to the homepage &rarr;
          </a>
        )}
        <div className="text-2xl flex items-center justify-center gap-3">
          <a
            href="https://github.com/invertase/docs.page"
            className="opacity-100 transition-all hover:opacity-75"
          >
            <i className="fa-brands fa-github" />
          </a>
          <a
            href="https://twitter.com/invertaseio"
            className="opacity-100 transition-all hover:opacity-75"
          >
            <i className="fa-brands fa-twitter" />
          </a>
        </div>
      </div>
    </div>
  );
}
