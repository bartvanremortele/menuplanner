import baseConfig, { restrictEnvAccess } from "@menuplanner/eslint-config/base";
import nextjsConfig from "@menuplanner/eslint-config/nextjs";
import reactConfig from "@menuplanner/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
