import { resolve } from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

// https://vitest.dev/config/
const config = defineConfig({
  resolve: {
    alias: [{ find: "~", replacement: resolve(__dirname, "src") }],
  },
  test: {
    exclude: [...configDefaults.exclude],
    globals: true,
    root: "src",
  },
});

export default config;
