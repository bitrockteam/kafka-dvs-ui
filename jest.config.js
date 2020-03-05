module.exports = {
  'roots': [
    '<rootDir>/__tests__'
  ],
  'transform': {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [2304]
      }
    },
  },
  reporters: [
    'default',
    'jest-junit'
  ],
};