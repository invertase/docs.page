import { Scripts } from "@remix-run/react";
import { type Context, PageContext } from "~/context";
import { DocsLayout } from "./DocsLayout";

export function DocsPage({ ctx }: { ctx: Context }) {
  return (
    <PageContext.Provider value={ctx}>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__docsPage = ${JSON.stringify(ctx)}`,
        }}
      />
      <Scripts />
      <DocsLayout />
    </PageContext.Provider>
  );
}