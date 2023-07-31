/// <reference types="vitest" />
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    visualizer({
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
      filename: "analyse.html",
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
  },
  build: {
    outDir: "build",
  },
  server: {
    open: true,
    port: 3000,
  },
});