import baseConfig from "@menuplanner/eslint-config/base";
import reactConfig from "@menuplanner/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
