import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/?(*.)+(test|spec).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/e2e/'],
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'hooks/**/*.ts',
    'lib/**/*.ts',
    'store/**/*.ts',
    '!**/*.test.{ts,tsx}',
    '!**/index.ts',
  ],
}

export default createJestConfig(config)
