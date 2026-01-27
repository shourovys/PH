module.exports = {
  preset: '@nestjs/jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.spec.(ts|js)', '**/?(*.)+(spec|test).(ts|js)'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};