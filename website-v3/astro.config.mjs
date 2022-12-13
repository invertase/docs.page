import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';
import react from '@astrojs/react';
import prefetch from '@astrojs/prefetch';

// https://astro.build/config

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: process.env.VERCEL ? vercel() : node({ mode: 'standalone' }),
  integrations: [tailwind(), react(), prefetch()],
});
