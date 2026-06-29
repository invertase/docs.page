import type { DocsNotFoundPageData } from "@/components/docs-not-found";
import type { DocsBundlePayload } from "./docs-bundle-api";
import type { PublicDocsPathRoute } from "./docs-canonical";
import type { ResolvedDocsRoute } from "./docs-routing";

export type DocPageProps = {
  kind: "doc" | "debug";
  route: ResolvedDocsRoute;
  bundle: DocsBundlePayload;
  meta: {
    hasAgent: boolean;
    initialAgentPanelOpen: boolean;
    requestOrigin: string;
    publicPathRoute: PublicDocsPathRoute;
  };
};

export type ErrorPageProps = {
  kind: "error";
  error: {
    name: string;
    message: string;
    source?: string;
  };
};

export type RawPageProps = {
  kind: "raw";
};

export type HomePageProps = {
  kind: "home";
};

export type NotFoundPageProps = {
  kind: "notFound";
  notFound: DocsNotFoundPageData;
};

export type PageProps =
  | DocPageProps
  | ErrorPageProps
  | NotFoundPageProps
  | RawPageProps
  | HomePageProps;
