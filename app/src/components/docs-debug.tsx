import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import type { ResolvedDocsRoute } from "@/lib/docs-routing";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export type DocsDebugError = {
  code?: string | number;
  name?: string;
  message: string;
  source?: string;
};

export type DocsDebugDetailsProps = {
  route?: ResolvedDocsRoute;
  bundle?: unknown;
  error?: DocsDebugError;
  bundleApiPath?: string;
  pathChunks?: string[];
};

function RouteTable({ route }: { route: ResolvedDocsRoute }) {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="w-[200px]">Owner</TableCell>
          <TableCell>{route.owner}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-[200px]">Repository</TableCell>
          <TableCell>{route.repository}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-[200px]">Ref</TableCell>
          <TableCell>{route.ref ?? "(default branch)"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-[200px]">Path</TableCell>
          <TableCell>{route.docPath || "(root document)"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-[200px]">Request mode</TableCell>
          <TableCell>{route.requestMode}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-[200px]">Public pathname</TableCell>
          <TableCell>{route.publicPathname}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-[200px]">Canonical pathname</TableCell>
          <TableCell>{route.canonicalPathname}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="w-[200px]">Canonical URL</TableCell>
          <TableCell>{route.canonicalUrl ?? "(none)"}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export function DocsDebugDetails({
  route,
  bundle,
  error,
  bundleApiPath,
  pathChunks,
}: DocsDebugDetailsProps) {
  const title = route
    ? `${route.owner}/${route.repository}`
    : pathChunks?.length
      ? pathChunks.join("/")
      : "Debug";

  return (
    <div className="mx-auto mt-12 w-full max-w-5xl px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pathChunks?.length ? (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-[200px]">Path segments</TableCell>
                  <TableCell>{pathChunks.join(" / ")}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : null}
          {route ? <RouteTable route={route} /> : null}
          {bundleApiPath ? (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-[200px]">Bundle API</TableCell>
                  <TableCell className="break-all">{bundleApiPath}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : null}
          {error ? (
            <pre className="overflow-x-auto rounded-lg border p-4 text-sm">
              {JSON.stringify(error, null, 2)}
            </pre>
          ) : null}
          {bundle ? (
            <pre className="overflow-x-auto rounded-lg border p-4 text-sm">
              {JSON.stringify(bundle, null, 2)}
            </pre>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export function DocsDebug() {
  const { route, bundle } = useDocPageContext();

  return <DocsDebugDetails route={route} bundle={bundle} />;
}

export function DocsBundleErrorCard({
  error,
}: {
  error: {
    name: string;
    message: string;
    source?: string;
  };
}) {
  return (
    <main className="flex min-h-screen flex-1 justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-950 dark:bg-zinc-950">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
          Bundle error
        </p>
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
          {error.name}
        </h1>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          {error.message}
        </p>
        {error.source ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Source: {error.source}
          </p>
        ) : null}
      </div>
    </main>
  );
}
