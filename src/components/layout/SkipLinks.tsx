"use client";

/**
 * Skip Links para Acessibilidade
 * Permite que usuários de teclado/leitor de tela pulem para seções importantes
 */
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="skip-link"
        tabIndex={0}
      >
        Ir para conteúdo principal
      </a>
      <a
        href="#navigation"
        className="skip-link"
        tabIndex={0}
      >
        Ir para navegação
      </a>
      <a
        href="#footer"
        className="skip-link"
        tabIndex={0}
      >
        Ir para rodapé
      </a>
    </div>
  );
}
