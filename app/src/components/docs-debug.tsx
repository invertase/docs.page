import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useDocPageContext } from "@/hooks/use-doc-page-context";

export function DocsDebug() {
  const { route, bundle } = useDocPageContext();

  return (
    <div className="max-w-5xl mx-auto px-4 mt-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            {route.owner}/{route.repository}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableBody>
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
          <pre className="overflow-x-auto rounded-lg border p-4 text-sm">
            {JSON.stringify(bundle, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
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
