import Path from "node:path";
import { defineConfig } from "vite";
export default defineConfig({
  base: "/",
  build: {
    outDir: "preview_dist/",
    emptyOutDir: true,
    rollupOptions: {
      input: [
        Path.resolve(__dirname, "index.html"),
        Path.resolve(__dirname, "main.ts"),
      ],
      output: {
        preserveModules: false,
        entryFileNames: () => "[name].js",
        assetFileNames: () => "[name].[ext]",
      },
    },
  },
});
