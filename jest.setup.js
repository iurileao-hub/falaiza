/**
 * Setup do Jest - Configuracao global dos testes
 *
 * Este arquivo e executado antes de cada arquivo de teste
 * e configura os matchers do Testing Library e jest-axe.
 */

// Estende o expect com matchers do Testing Library
import '@testing-library/jest-dom';

// Configuracao do jest-axe para portugues brasileiro
import { configureAxe, toHaveNoViolations } from 'jest-axe';

// Adiciona o matcher toHaveNoViolations ao expect
expect.extend(toHaveNoViolations);

// Configura axe-core com regras WCAG 2.1 AA
const axeConfig = {
  rules: {
    // Desabilita regras que podem dar falsos positivos em testes unitarios
    'color-contrast': { enabled: true },
    'landmark-one-main': { enabled: false }, // Layout completo nao esta presente
    'region': { enabled: false }, // Layout completo nao esta presente
    'page-has-heading-one': { enabled: false }, // Layout completo nao esta presente
  },
  // Tags para WCAG 2.1 AA
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
  },
};

// Exporta configuracao do axe para uso nos testes
export const configuredAxe = configureAxe(axeConfig);

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/manifestacao/relato',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock do ResizeObserver (nao disponivel no jsdom)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock do matchMedia (para consultas de media queries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
global.URL.revokeObjectURL = jest.fn();

// Mock do MediaRecorder
global.MediaRecorder = class MediaRecorder {
  constructor() {
    this.state = 'inactive';
  }
  start() { this.state = 'recording'; }
  stop() { this.state = 'inactive'; }
  pause() { this.state = 'paused'; }
  resume() { this.state = 'recording'; }
  addEventListener() {}
  removeEventListener() {}
};

// Suprimir avisos de console durante testes
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Ignora avisos de act() e outros avisos conhecidos
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('act(') ||
       args[0].includes('Warning:'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
