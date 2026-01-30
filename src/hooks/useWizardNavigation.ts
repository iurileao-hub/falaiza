"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useManifestacaoStore } from "@/stores/manifestacaoStore";

interface UseWizardNavigationOptions {
  /** Mensagem de confirmação para recomeçar */
  mensagemRecomecar?: string;
}

/**
 * Hook para centralizar navegação do wizard de manifestação
 * Elimina duplicação de handleRecomecar em todas as 5 páginas
 */
export function useWizardNavigation(options?: UseWizardNavigationOptions) {
  const router = useRouter();
  const { resetar, irParaEtapa } = useManifestacaoStore();

  const mensagem = options?.mensagemRecomecar || "Tem certeza que deseja recomeçar? Todos os dados serão apagados.";

  const handleRecomecar = useCallback(() => {
    const confirmado = window.confirm(mensagem);
    if (confirmado) {
      resetar();
      router.replace("/manifestacao/relato?nova=true");
    }
  }, [mensagem, resetar, router]);

  const navegarPara = useCallback(
    (etapa: number, rota: string) => {
      irParaEtapa(etapa);
      router.push(rota);
    },
    [irParaEtapa, router]
  );

  return { handleRecomecar, navegarPara };
}
