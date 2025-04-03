/* eslint-disable */
const eslint = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const typescriptEslintParser = require('@typescript-eslint/parser');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');

// Common settings for all files
const commonConfig = {
  // Global ignores
  ignores: ['node_modules/**', '.expo/**', 'dist/**', 'eslint.config.js'],
  // React configuration
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    globals: {
      // Browser globals
      window: 'readonly',
      document: 'readonly',
      // Node.js globals
      process: 'readonly',
      require: 'readonly',
      module: 'readonly',
      global: 'readonly',
      // React Native globals
      fetch: 'readonly',
      console: 'readonly',
      // Jest globals
      jest: 'readonly',
      describe: 'readonly',
      it: 'readonly',
      expect: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
    },
  },
  rules: {
    // Common rules for all files
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};

// TypeScript specific configuration
const typescriptConfig = {
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    parser: typescriptEslintParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      project: './tsconfig.json',
    },
  },
  plugins: {
    '@typescript-eslint': typescriptEslintPlugin,
  },
  rules: {
    // Turn off ESLint's default rule and use TypeScript's rule instead
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
};

// JavaScript specific configuration
const javascriptConfig = {
  files: ['**/*.js', '**/*.jsx'],
  rules: {
    // Use standard ESLint rule for JavaScript files
    'no-unused-vars': ['warn'],
  },
};

module.exports = [
  eslint.configs.recommended,
  commonConfig,
  typescriptConfig,
  javascriptConfig,
];