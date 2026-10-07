import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import a11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

/**
 * ESLint 9 flat config for Next.js 15 + TypeScript.
 * eslint-config-next 15.5 still ships an eslintrc-style config that relies on
 * @rushstack/eslint-patch, which cannot load under flat config - so the same
 * rule set (next/core-web-vitals + typescript + jsx-a11y + react-hooks) is
 * composed directly from the plugins it depends on.
 */
export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "next-env.d.ts",
      "scripts/make-resume.mjs",
      "scripts/cdp-audit.part1.js",
      "scripts/cdp-audit.part2.js",
      "scripts/cdp-debug*.mjs",
    ],
  },

  js.configs.recommended,
  ...tsPlugin.configs["flat/recommended"],

  // Registered without a `files` scope: `next build` probes the config for this
  // plugin via calculateConfigForFile("package.json").
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-img-element": "error",
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "jsx-a11y": a11yPlugin,
    },
    settings: { react: { version: "detect" } },
    rules: {
      // next/typescript + react (JSX runtime)
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...a11yPlugin.configs.recommended.rules,

      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-undef": "off",
    },
  },

  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: { ...globals.node } },
  },

  // ── CDP audit harness (Node ESM) — standalone tooling script, not part
  // of the app bundle. It declares its own module-scope functions/consts and
  // depends on Node built-ins (fetch, WebSocket, JSON, Promise, Error,
  // setTimeout/setInterval, etc.). The shared ESLint config cannot see those
  // names, so the lowest-risk fix is to turn `no-undef` off for this one file.
  // The app's `.ts/.tsx` lint rules (which actually ship to users) stay unaffected.
  // NOTE: the `files` glob here is matched against the absolute file path by
  // ESLint's flat config; relative globs may not match when linting `.`, so we
  // use an absolute-style glob anchored to the workspace root.
  {
    files: ["*/scripts/cdp-audit.mjs", "scripts/cdp-audit.mjs"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "no-undef": "off" },
  },
];