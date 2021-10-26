const config = {
  env: { browser: true },

  ignorePatterns: ['jq-range-slider-plugin.js'],

  extends: [
    // List of recommended rules by https://github.com/iamturns/eslint-config-airbnb-typescript
    'airbnb-base',

    // some rules from https://github.com/fullstack-development/front-end-best-practices/tree/master/JS
    'plugin:fsd/all',

    // detect bugs and suspicious patterns in your code (huge unreadable blocks of code)
    'plugin:sonarjs/recommended',

    /**
     * Enforce best practices for JavaScript promises.
     */
    'plugin:promise/recommended',

    // prevent use of extended native objects
    'plugin:no-use-extend-native/recommended',

    'plugin:lit/recommended',
  ],
  plugins: ['sonarjs', 'promise', 'lit', 'fsd'],
  rules: {
    // FIXME: if you know how to make it works with chaining calls of several methods use['error', { allowAfterThis: true }]
    'no-underscore-dangle': 'off',

    'import/prefer-default-export': 'off',

    'sonarjs/no-nested-template-literals': 'off',

    // https://github.com/fullstack-development/front-end-best-practices/blob/master/JS/README.md#1.17
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling'],
          'index',
        ],
        'newlines-between': 'always',
      },
    ],

    // https://github.com/airbnb/javascript#destructuring--object
    'prefer-destructuring': [
      'error',
      {
        array: true,
        object: true,
      },
    ],

    // https://github.com/airbnb/javascript#functions--declarations
    'func-style': ['error', 'expression'],

    // https://github.com/airbnb/javascript#functions--defaults-last
    'default-param-last': ['error'],

    // https://github.com/airbnb/javascript#arrows--use-them
    'prefer-arrow-callback': [
      'error',
      { allowNamedFunctions: false, allowUnboundThis: false },
    ],

    // https://github.com/airbnb/javascript#arrows--implicit-return
    'arrow-body-style': ['error', 'as-needed'],

    /*
     * TODO: here should be rule like as 'method-void-implicit-error'
     * https://github.com/airbnb/javascript#constructors--chaining
     */

    // https://github.com/airbnb/javascript#comments--multiline
    'multiline-comment-style': ['error', 'starred-block'],

    // https://github.com/airbnb/javascript#comments--singleline
    'line-comment-position': ['error', { position: 'above' }],
    'lines-around-comment': [
      'error',
      {
        beforeBlockComment: true,
        beforeLineComment: true,
        allowBlockStart: true,
        allowClassStart: true,
        allowObjectStart: true,
        allowArrayStart: true,
      },
    ],

    // https://github.com/airbnb/javascript#whitespace--chains
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],

    // https://github.com/airbnb/javascript#whitespace--after-blocks
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['block-like'], next: '*' },
      { blankLine: 'always', prev: ['const', 'let'], next: ['block-like'] },
      { blankLine: 'always', prev: '*', next: ['return', 'break', 'debugger'] },
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'any', prev: ['case'], next: ['case', 'default'] },
    ],
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@layouts', './app/src/layouts/'],
          ['@plugin', './app/src/plugin/'],
          ['@views', './app/src/components/views/'],
          ['@models', './app/src/components/models/'],
          ['@presenters', './app/src/components/presenters/'],
          ['@shared', './app/src/shared/'],
          ['@assets', './app/src/assets/'],
        ],
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
      },
    },
  },
  overrides: [
    {
      files: ['**/*.ts'],

      // https://github.com/iamturns/eslint-config-airbnb-typescript
      parserOptions: {
        project: './tsconfig.json',
      },

      extends: [
        // List of recommended rules by https://github.com/iamturns/eslint-config-airbnb-typescript
        'airbnb-typescript/base',
      ],

      rules: {
        'dot-notation': 'off',
        '@typescript-eslint/dot-notation': [
          'error',
          {
            allowPrivateClassPropertyAccess: true,
            allowProtectedClassPropertyAccess: true,
          },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['**/*.test.ts'],
      rules: {
        '@typescript-eslint/dot-notation': [
          'error',
          {
            allowPrivateClassPropertyAccess: true,
            allowProtectedClassPropertyAccess: true,
          },
        ],
      },
    },
  ],
};

/**
 * Enables (eslint-plugin-prettier), which run Prettier analysis as part of ESLint.
 * Disable any linting rule that might interfere with an existing Prettier rule using(eslint-config-prettier).
 * Should be last for override other configs.
 */
const prettierExtending = 'plugin:prettier/recommended';
config.extends.push(prettierExtending);
config.overrides[0].extends.push(prettierExtending);

module.exports = config;
