"use client";

import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Componente de barreira de erro para capturar erros de renderização
 * e exibir uma mensagem amigável ao usuário.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
          <div className="text-center max-w-md space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
              <span className="text-4xl" role="img" aria-label="Erro">
                ⚠️
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#192D4B] mb-2">
                Algo deu errado
              </h1>
              <p className="text-gray-600">
                Ocorreu um erro inesperado. Por favor, tente recarregar a
                página ou voltar ao início.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#192D4B] text-white font-medium rounded-lg hover:bg-[#28477D] transition-colors"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
