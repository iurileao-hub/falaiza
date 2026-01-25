/**
 * Declarações de tipos para jest-axe
 */
declare module 'jest-axe' {
  import { AxeResults, RunOptions } from 'axe-core';

  export interface JestAxeConfigureOptions extends RunOptions {
    globalOptions?: unknown;
  }

  export function axe(
    html: Element | string,
    options?: JestAxeConfigureOptions
  ): Promise<AxeResults>;

  export const toHaveNoViolations: {
    toHaveNoViolations(results: AxeResults): { pass: boolean; message: () => string };
  };

  export function configureAxe(options: JestAxeConfigureOptions): typeof axe;
}
