import { defineConfig } from "vite";
import Path from "path";
export default defineConfig({
  base: "/",
  build: {
    outDir: "preview_dist/",
    emptyOutDir: true,
    rollupOptions: {
      input: Path.resolve(__dirname, "index.html"),
    },
    assetsDir: "",
  },
});
