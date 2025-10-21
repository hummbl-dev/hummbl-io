import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import path from 'path';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Base configuration
  {
    ignores: [
      'node_modules/',
      'dist/',
      '.next/',
      'coverage/',
      '**/*.d.ts',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.cjs',
    ],
  },

  // Config files
  {
    files: ['vite.config.ts', 'vitest.config.ts', 'vitest.setup.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },

  // JavaScript and TypeScript
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/*.d.ts', '**/*.config.*'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      // Base rules
      ...js.configs.recommended.rules,
      // TypeScript rules
      ...tsPlugin.configs['recommended'].rules,
      // React rules
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      // JSX A11y rules
      ...jsxA11yPlugin.configs.recommended.rules,

      // Custom rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn', // Warn on any types
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
