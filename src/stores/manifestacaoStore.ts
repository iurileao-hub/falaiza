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
import type { ClassificacaoResultado } from "@/lib/iza";

interface ManifestacaoState {
  // Dados da manifestação
  manifestacao: Partial<Manifestacao>;
  anexos: PreviewAnexo[];

  // Classificação IA (IZA Inteligente)
  classificacao: ClassificacaoResultado | null;

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

  // Classificação IA
  setClassificacao: (classificacao: ClassificacaoResultado) => void;
  atualizarClassificacao: (dados: Partial<ClassificacaoResultado>) => void;

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
      classificacao: null,
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

      // Classificação IA
      setClassificacao: (classificacao) =>
        set((state) => {
          // Sincronizar tipo e assunto da classificação com a manifestação
          const tipoId = classificacao.tipo.id;
          const orgaoId = classificacao.orgao.id;

          return {
            classificacao,
            manifestacao: {
              ...state.manifestacao,
              tipo: tipoId,
              assunto: {
                categoria: orgaoId,
              },
              atualizadoEm: new Date(),
            },
          };
        }),

      atualizarClassificacao: (dados) =>
        set((state) => {
          if (!state.classificacao) return state;

          const novaClassificacao = {
            ...state.classificacao,
            ...dados,
            meta: {
              ...state.classificacao.meta,
              editadoPeloUsuario: true,
            },
          };

          // Sincronizar com manifestação se tipo ou órgão mudaram
          const updates: Partial<Manifestacao> = {
            atualizadoEm: new Date(),
          };

          if (dados.tipo) {
            updates.tipo = dados.tipo.id;
          }
          if (dados.orgao) {
            updates.assunto = {
              categoria: dados.orgao.id,
              subcategoria: state.manifestacao.assunto?.subcategoria,
              descricao: state.manifestacao.assunto?.descricao,
            };
          }

          return {
            classificacao: novaClassificacao,
            manifestacao: {
              ...state.manifestacao,
              ...updates,
            },
          };
        }),

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
      /**
       * Novo fluxo de 5 etapas (Story-First com IZA Inteligente):
       * 1. Relato → Texto (min 20 chars) OU anexo
       * 2. Sugestão → Classificação confirmada (tipo + órgão)
       * 3. Anexos → Opcional
       * 4. Identificação → Condicional (anônimo ou dados completos)
       * 5. Confirmação → Sempre pode avançar
       */
      podeAvancar: () => {
        const state = get();
        const { manifestacao, anexos, classificacao } = state;

        switch (state.etapaAtual) {
          case 1: // Relato (story-first)
            const temRelato = (manifestacao.relato?.length || 0) >= 20;
            const temAnexo = anexos.length > 0;
            return temRelato || temAnexo;

          case 2: // Sugestão (classificação IA)
            // Precisa ter classificação com tipo e órgão definidos
            return !!(
              classificacao &&
              manifestacao.tipo &&
              manifestacao.assunto?.categoria
            );

          case 3: // Anexos
            return true; // Opcional

          case 4: // Identificação
            if (manifestacao.anonimo) return true;
            const id = manifestacao.identificacao;
            return !!(id?.nome && id?.cpf && id?.email);

          case 5: // Confirmação
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

      // Reset - limpa estado e remove dados persistidos (inclui PII)
      resetar: () => {
        // Limpar localStorage para remover PII persistido
        if (typeof window !== "undefined") {
          localStorage.removeItem("manifestacao-ouvidoria");
        }
        set({
          manifestacao: { ...estadoInicial, criadoEm: new Date() },
          anexos: [],
          classificacao: null,
          etapaAtual: 1,
        });
      },
    }),
    {
      name: "manifestacao-ouvidoria",
      partialize: (state) => ({
        manifestacao: {
          ...state.manifestacao,
          // Não persistir dados pessoais (PII) - LGPD
          identificacao: null,
        },
        // Não persistir anexos - blob URLs não sobrevivem ao reload
        // O usuário precisará adicionar novamente após recarregar a página
        anexos: [],
        classificacao: state.classificacao,
        etapaAtual: state.etapaAtual,
      }),
      // Ao reidratar, garantir que anexos inválidos sejam removidos
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Limpar anexos sem URL válida (não persistem entre sessões)
          state.anexos = state.anexos.filter((a) => a.url && a.url.length > 0);
        }
      },
    }
  )
);
