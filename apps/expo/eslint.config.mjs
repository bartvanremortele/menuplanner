import baseConfig from "@menuplanner/eslint-config/base";
import reactConfig from "@menuplanner/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  ...baseConfig,
  ...reactConfig,
  // Allow require() for common asset extensions in Expo/Metro
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@typescript-eslint/no-require-imports": [
        "warn",
        {
          allow: [
            "\\.(aac|aiff|avif|bmp|caf|db|gif|heic|html|jpeg|jpg|json|m4a|m4v|mov|mp3|mp4|mpeg|mpg|otf|pdf|png|psd|svg|ttf|wav|webm|webp|xml|yaml|yml|zip)$",
          ],
        },
      ],
    },
  },
];
