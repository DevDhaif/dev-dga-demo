import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // '@' -> src. keep in sync with tsconfig.app.json paths + vitest.config.ts.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
