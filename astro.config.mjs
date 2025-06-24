import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
      },
  integrations: [svelte()],

});
