/**
 * Utilitarios para testes de acessibilidade
 *
 * Funcoes auxiliares para renderizar componentes
 * e executar verificacoes de acessibilidade com axe-core.
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { axe, toHaveNoViolations, JestAxeConfigureOptions } from 'jest-axe';

// Estende os matchers do Jest
expect.extend(toHaveNoViolations);

/**
 * Configuracao do axe-core para WCAG 2.1 AA
 */
export const axeOptions: JestAxeConfigureOptions = {
  rules: {
    // Regras habilitadas para WCAG 2.1 AA
    'color-contrast': { enabled: true },
    'aria-allowed-attr': { enabled: true },
    'aria-hidden-focus': { enabled: true },
    'aria-input-field-name': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-required-children': { enabled: true },
    'aria-required-parent': { enabled: true },
    'aria-roles': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    'aria-valid-attr': { enabled: true },
    'button-name': { enabled: true },
    'duplicate-id-aria': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    'image-alt': { enabled: true },
    'input-button-name': { enabled: true },
    'input-image-alt': { enabled: true },
    'label': { enabled: true },
    'link-name': { enabled: true },
    'list': { enabled: true },
    'listitem': { enabled: true },
    'tabindex': { enabled: true },

    // Desabilitadas - requerem contexto de pagina completa
    'landmark-one-main': { enabled: false },
    'region': { enabled: false },
    'page-has-heading-one': { enabled: false },
    'html-has-lang': { enabled: false },
    'document-title': { enabled: false },
    'bypass': { enabled: false },
  },
};

/**
 * Provider wrapper para testes
 * Adicione providers globais aqui se necessario
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

/**
 * Render customizado com providers
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Verifica acessibilidade de um container HTML
 *
 * @param container - Elemento DOM para verificar
 * @returns Resultado da verificacao do axe-core
 */
export const checkA11y = async (container: Element) => {
  const results = await axe(container, axeOptions);
  return results;
};

/**
 * Formata violacoes de acessibilidade para exibicao
 *
 * @param violations - Array de violacoes do axe-core
 * @returns String formatada com detalhes das violacoes
 */
export const formatViolations = (violations: Array<{
  id: string;
  impact?: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{ html: string; failureSummary?: string }>;
}>) => {
  if (violations.length === 0) {
    return 'Nenhuma violacao de acessibilidade encontrada!';
  }

  return violations
    .map((violation) => {
      const nodeInfo = violation.nodes
        .map((node) => `    - ${node.html}\n      ${node.failureSummary || ''}`)
        .join('\n');

      return `
[${violation.impact?.toUpperCase() || 'UNKNOWN'}] ${violation.id}
Descricao: ${violation.description}
Ajuda: ${violation.help}
Saiba mais: ${violation.helpUrl}
Elementos afetados:
${nodeInfo}
`;
    })
    .join('\n---\n');
};

// Re-exporta funcoes do testing-library
export * from '@testing-library/react';
export { customRender as render };
