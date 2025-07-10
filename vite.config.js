import { defineConfig } from "vite";
import Path from "path";
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
        entryFileNames: () => "[name].[format].js",
        assetFileNames: () => "[name].[ext]",
      },
    },
  },
});
