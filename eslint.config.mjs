// ESLint 10 flat config. (The previous file used legacy `.eslintrc`-style
// `module.exports` inside a `.mjs`, which throws "module is not defined" and
// is not even a valid flat config — linting was fully broken.)

import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules/',
      '.expo/',
      'dist/',
      'build/',
      'artifacts/',
      'supabase/functions/',
      'shims/',
      'scripts/',
      '*.config.js',
      'babel.config.js',
      'metro.config.js',
      // One-off Node maintenance scripts at repo root (not app code).
      'map_migration.js',
      'replace.js',
      'replace_scrollviews.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // TypeScript handles undefined-symbol checking; no-undef produces false
      // positives on RN/Expo globals (__DEV__, fetch, etc.).
      'no-undef': 'off',
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
  prettierConfig,
];
