module.exports = {
  rootDir: './../../app/src/',
  preset: 'ts-jest/presets/js-with-ts',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/../coverage',

  // FIXME: should be replaced after ts-jest v27 release(ESM support)
  transformIgnorePatterns: [
    'node_modules/(?!(lodash-es|lit-html|@open-wc/lit-helpers))',
  ],

  // https://github.com/kulshekhar/ts-jest/issues/1035#issuecomment-486442977 and https://github.com/jsdom/jsdom/pull/2666#issuecomment-691216178
  setupFilesAfterEnv: ['<rootDir>/../../configs/jest/setupEvents.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/shared/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/../tests/__mocks__/fileMock.js',
    '\\.(css|s[ac]ss)$': '<rootDir>/../tests/__mocks__/styleMock.js',
    '@layouts(.*)$': '<rootDir>/layouts/$1',
    '@plugin(.*)$': '<rootDir>/plugin/$1',
    '@components(.*)$': '<rootDir>/components/$1',
    '@features(.*)$': '<rootDir>/features/$1',
    '@shared(.*)$': '<rootDir>/shared/$1',
    '@assets(.*)$': '<rootDir>/assets/$1',
  },

  globals: {
    'ts-jest': {
      babelConfig: {
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
        plugins: ['@babel/plugin-proposal-class-properties'],
      },
    },
  },
};
