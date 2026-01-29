/**
 * Declarações de tipos para matchers de teste
 *
 * Estende o Jest com matchers do @testing-library/jest-dom
 * e do jest-axe (toHaveNoViolations).
 */
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      /** Verifica que não há violações de acessibilidade (jest-axe) */
      toHaveNoViolations(): R;
    }
  }
}
