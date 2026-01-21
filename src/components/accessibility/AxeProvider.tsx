"use client";

/**
 * Componente wrapper para acessibilidade
 * axe-core desabilitado temporariamente devido a incompatibilidade com React 18 ESM
 * Testes de acessibilidade podem ser executados via npm run test:a11y
 */
export function AxeProvider({ children }: { children: React.ReactNode }) {
  // axe-core runtime desabilitado - usar testes automatizados em vez disso
  return <>{children}</>;
}
