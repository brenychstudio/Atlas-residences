import "dotenv/config";
// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:4321",
  integrations: [react()],

   vite: {
    plugins: [tailwindcss()],
  },
});