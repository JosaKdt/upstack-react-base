/**
 * 🧪 Configuration Jest - Tests d'Acceptation Sprint 1
 * 
 * Cette configuration est optimisée pour les tests d'acceptation
 * qui valident les User Stories via des appels HTTP réels.
 */

import type { Config } from 'jest'

const config: Config = {
  // Environnement Node.js pour les tests d'acceptation
  testEnvironment: 'node',
  
  // Support TypeScript
  preset: 'ts-jest',
  
  // Patterns de fichiers de test
  testMatch: [
    '**/__tests__/**/*.acceptance.test.ts',
    '**/?(*.)+(acceptance).test.ts'
  ],
  
  // Timeout augmenté pour les tests d'acceptation (appels HTTP)
  testTimeout: 30000, // 30 secondes par test
  
  // Exécution séquentielle (tests dépendent de l'état)
  maxWorkers: 1,
  
  // Verbose pour traçabilité Given/When/Then
  verbose: true,
  
  // Reporters
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'SETICE - Tests d\'Acceptation Sprint 1',
        outputPath: './__tests__/reports/acceptance-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
        sort: 'status',
        executionTimeWarningThreshold: 5,
      }
    ]
  ],
  
  // Couverture de code (optionnelle pour tests d'acceptation)
  collectCoverageFrom: [
    'app/api/**/*.ts',
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
  ],
  
  // Ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
  ],
  
  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Setup avant les tests
  globalSetup: '<rootDir>/__tests__/setup/global-setup.ts',
  
  // Teardown après les tests
  globalTeardown: '<rootDir>/__tests__/setup/global-teardown.ts',
}

export default config
