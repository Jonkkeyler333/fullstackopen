import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylisticJs from '@stylistic/eslint-plugin'

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'windows'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**'],
  }
]);
