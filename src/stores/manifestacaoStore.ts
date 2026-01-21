"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Manifestacao,
  TipoManifestacao,
  AssuntoManifestacao,
  IdentificacaoCidadao,
  StatusManifestacao,
} from "@/types/manifestacao";
import { PreviewAnexo } from "@/types/anexo";
import { TOTAL_ETAPAS, TIPOS_MANIFESTACAO } from "@/lib/constants";

interface ManifestacaoState {
  // Dados da manifestação
  manifestacao: Partial<Manifestacao>;
  anexos: PreviewAnexo[];

  // Estado do wizard
  etapaAtual: number;

  // Ações
  setTipo: (tipo: TipoManifestacao) => void;
  setAssunto: (assunto: AssuntoManifestacao) => void;
  setRelato: (relato: string) => void;
  setAnonimo: (anonimo: boolean) => void;
  setIdentificacao: (identificacao: IdentificacaoCidadao | null) => void;
  setProtocolo: (protocolo: string) => void;
  setStatus: (status: StatusManifestacao) => void;

  // Anexos
  adicionarAnexo: (anexo: PreviewAnexo) => void;
  removerAnexo: (id: string) => void;
  limparAnexos: () => void;

  // Navegação
  avancarEtapa: () => void;
  voltarEtapa: () => void;
  irParaEtapa: (etapa: number) => void;

  // Validação
  podeAvancar: () => boolean;
  podeVoltar: () => boolean;
  permiteAnonimo: () => boolean;

  // Reset
  resetar: () => void;
}

const estadoInicial: Partial<Manifestacao> = {
  status: "rascunho",
  etapaAtual: 1,
  tipo: null,
  assunto: null,
  relato: "",
  anonimo: false,
  identificacao: null,
  criadoEm: new Date(),
  atualizadoEm: new Date(),
};

export const useManifestacaoStore = create<ManifestacaoState>()(
  persist(
    (set, get) => ({
      manifestacao: { ...estadoInicial },
      anexos: [],
      etapaAtual: 1,

      // Setters
      setTipo: (tipo) =>
        set((state) => ({
          manifestacao: {
            ...state.manifestacao,
            tipo,
            atualizadoEm: new Date(),
          },
        })),

      setAssunto: (assunto) =>
        set((state) => ({
          manifestacao: {
            ...state.manifestacao,
            assunto,
            atualizadoEm: new Date(),
          },
        })),

      setRelato: (relato) =>
        set((state) => ({
          manifestacao: {
            ...state.manifestacao,
            relato,
            atualizadoEm: new Date(),
          },
        })),

      setAnonimo: (anonimo) =>
        set((state) => ({
          manifestacao: {
            ...state.manifestacao,
            anonimo,
            // Se marcar como anônimo, limpar identificação
            identificacao: anonimo ? null : state.manifestacao.identificacao,
            atualizadoEm: new Date(),
          },
        })),

      setIdentificacao: (identificacao) =>
        set((state) => ({
          manifestacao: {
            ...state.manifestacao,
            identificacao,
            atualizadoEm: new Date(),
          },
        })),

      setProtocolo: (protocolo) =>
        set((state) => ({
          manifestacao: {
            ...state.manifestacao,
            protocolo,
            enviadoEm: new Date(),
            atualizadoEm: new Date(),
          },
        })),

      setStatus: (status) =>
        set((state) => ({
          manifestacao: {
            ...state.manifestacao,
            status,
            atualizadoEm: new Date(),
          },
        })),

      // Anexos
      adicionarAnexo: (anexo) =>
        set((state) => ({
          anexos: [...state.anexos, anexo],
        })),

      removerAnexo: (id) =>
        set((state) => ({
          anexos: state.anexos.filter((a) => a.id !== id),
        })),

      limparAnexos: () => set({ anexos: [] }),

      // Navegação
      avancarEtapa: () =>
        set((state) => {
          if (state.etapaAtual < TOTAL_ETAPAS && get().podeAvancar()) {
            return { etapaAtual: state.etapaAtual + 1 };
          }
          return state;
        }),

      voltarEtapa: () =>
        set((state) => {
          if (state.etapaAtual > 1) {
            return { etapaAtual: state.etapaAtual - 1 };
          }
          return state;
        }),

      irParaEtapa: (etapa) =>
        set(() => {
          if (etapa >= 1 && etapa <= TOTAL_ETAPAS) {
            return { etapaAtual: etapa };
          }
          return {};
        }),

      // Validação
      podeAvancar: () => {
        const state = get();
        const { manifestacao, anexos } = state;

        switch (state.etapaAtual) {
          case 1: // Tipo
            return !!manifestacao.tipo;

          case 2: // Assunto
            return !!manifestacao.assunto?.categoria;

          case 3: // Relato
            const temRelato = (manifestacao.relato?.length || 0) >= 20;
            const temAnexo = anexos.length > 0;
            return temRelato || temAnexo;

          case 4: // Anexos
            return true; // Opcional

          case 5: // Identificação
            if (manifestacao.anonimo) return true;
            const id = manifestacao.identificacao;
            return !!(id?.nome && id?.cpf && id?.email);

          case 6: // Confirmação
            return true;

          default:
            return false;
        }
      },

      podeVoltar: () => get().etapaAtual > 1,

      permiteAnonimo: () => {
        const tipo = get().manifestacao.tipo;
        if (!tipo) return false;
        const config = TIPOS_MANIFESTACAO.find((t) => t.id === tipo);
        return config?.permiteAnonimo ?? false;
      },

      // Reset
      resetar: () =>
        set({
          manifestacao: { ...estadoInicial, criadoEm: new Date() },
          anexos: [],
          etapaAtual: 1,
        }),
    }),
    {
      name: "manifestacao-ouvidoria",
      partialize: (state) => ({
        manifestacao: state.manifestacao,
        anexos: state.anexos.map((a) => ({ ...a, url: "" })), // Não persistir URLs
        etapaAtual: state.etapaAtual,
      }),
    }
  )
);
