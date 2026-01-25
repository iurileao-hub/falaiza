/**
 * Configuracao do Jest para testes de acessibilidade
 *
 * Este arquivo configura o Jest para executar testes com
 * suporte a TypeScript, path aliases e React Testing Library.
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Caminho para o diretorio do app Next.js
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // Ambiente de teste para componentes React
  testEnvironment: 'jsdom',

  // Setup apos o ambiente ser configurado
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Padrao de busca para arquivos de teste
  testMatch: [
    '**/tests/**/*.test.[jt]s?(x)',
    '**/__tests__/**/*.[jt]s?(x)',
  ],

  // Ignorar pastas
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],

  // Mapeamento de modulos para path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Transformar TypeScript com ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
  },

  // Extensoes de modulos suportadas
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Timeout padrao para testes (10 segundos)
  testTimeout: 10000,
};

module.exports = createJestConfig(customJestConfig);
