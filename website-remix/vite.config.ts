import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ['**'],
      routes(defineRoutes) {
        // Remix file routing has a strange priority order where preview comes after
        // the owner/repository route. This means that the preview route will never be
        // able to render full paths such as `/preview/getting-started`.
        return defineRoutes(route => {
          route('/', 'routes/_index/route.tsx');
          route('/preview/*', 'routes/preview.$/route.tsx');
          route('/:owner/:repository/*', 'routes/$owner.$repository.$/route.tsx');
        });
      },
      future: {
        unstable_singleFetch: true,
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
});
