import { Navigation } from "./navigation";

export function Docs() {
  return (
    <>
      <header className="border-b">
        <div className="max-w-8xl mx-auto px-4">
          <div className="h-8">top</div>
          <div className="h-8">bottom</div>
        </div>
      </header>
      <div className="relative mx-auto flex min-h-0 min-w-0 flex-1 flex-row w-full max-w-8xl px-4">
        <Navigation />
        <main className="min-h-0 min-w-0 overflow-auto">
          <h1 className="font-heading text-2xl">Title</h1>
        </main>
      </div>
    </>
  );
}
