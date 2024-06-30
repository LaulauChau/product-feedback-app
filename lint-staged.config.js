const config = {
  "*": [
    "biome check --no-errors-on-unmatched --files-ignore-unknown=true --write",
  ],
  "*.tsx": ["rustywind --write"],
};

export default config;
