import type { PublicDocsPathRoute } from "./docs-canonical";
import type { DocsBundlePayload } from "./docs-bundle-api";
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
  }
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

export type PageProps = DocPageProps | ErrorPageProps | RawPageProps | HomePageProps;
