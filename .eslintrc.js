module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    sourceType: 'module', // Default script
    ecmaVersion: 2017,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 150,
      },
    ],
  },
};
