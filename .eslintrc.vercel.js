module.exports = {
  extends: ['eslint:recommended'],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  rules: {
    // Add any specific rules for vercel-build.js here
  },
};
