module.exports = {
  env: { browser: true },
  /**
   * Alternative to "Espree" parser that can read Typescript code and produce said ESTree(the language ESLint can understand)
   */
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base', // List of recommended rules by https://github.com/iamturns/eslint-config-airbnb-typescript
    'plugin:fsd/all', // some rules from https://github.com/fullstack-development/front-end-best-practices/tree/master/JS
    'plugin:sonarjs/recommended', // detect bugs and suspicious patterns in your code (huge unreadable blocks of code)
    'plugin:no-use-extend-native/recommended', // prevent use of extended native objects
    /**
     * List of recommended rules for TypeScript from "@typescript-eslint" plugin
     */
    'plugin:@typescript-eslint/recommended',
    'plugin:lit/recommended',
    /**
     * Enables (eslint-plugin-prettier), which run Prettier analysis as part of ESLint.
     * Disable any linting rule that might interfere with an existing Prettier rule using(eslint-config-prettier).
     * Should be last for override other configs.
     */
    'plugin:prettier/recommended',
  ],
  plugins: ['no-loops', 'promise', 'lit', 'fsd'],
  rules: {
    // FIXME: if you know how to make it works with chaining calls of several methods use['error', { allowAfterThis: true }]
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'lines-between-class-members': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    // Disallow use of loops (for, for-in, while, do-while, for-of) - we have forEach, map etc.
    'no-loops/no-loops': 2,
    /**
     * Enforce best practices for JavaScript promises.
     */
    'promise/always-return': 'error',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-native': 'off',
    'promise/no-nesting': 'warn',
    'promise/no-promise-in-callback': 'warn',
    'promise/no-callback-in-promise': 'warn',
    'promise/avoid-new': 'warn',
    'promise/no-new-statics': 'error',
    'promise/no-return-in-finally': 'warn',
    'promise/valid-params': 'warn',
    // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/imports.js#L139
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@pug', './app/src/pug'],
          ['@layouts', './app/src/layouts'],
          ['@common.blocks', './app/src/components/common.blocks/'],
          ['@utils', './app/src/utils/'],
          ['@assets', './app/src/assets/'],
        ],
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
      },
    },
  },
};
