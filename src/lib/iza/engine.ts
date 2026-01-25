/**
 * Engine Principal da IZA Inteligente
 * Orquestra as 2 camadas de classificação com foco em privacidade
 *
 * Camada 1: Regras (sempre disponível, 0 KB, instantâneo)
 * Camada 2: Backend GDF (API com modelo robusto, transparente para usuário)
 *
 * Decisão arquitetural: ADR-001 (docs/decisions/2026-01-25-remocao-modelo-local.md)
 * - Modelo local removido por problemas de UX e acessibilidade
 * - Foco em Camada 1 robusta + API transparente
 */

import type {
  ClassificacaoResultado,
  OpcoesClassificacao,
  ConfiguracaoIA,
  CamadaClassificacao,
} from './types';

import { classificarPorRegras, classificacaoConfiavel } from './rules-engine';

// ============================================================================
// Estado Global do Engine
// ============================================================================

/** Configuração padrão de IA */
const configPadrao: ConfiguracaoIA = {
  backendGDFDisponivel: true, // Mock disponível
  usarBackendGDF: true,       // Habilitado por padrão
};

let configAtual: ConfiguracaoIA = { ...configPadrao };

// ============================================================================
// Camada 2: Backend GDF (Mock para demonstração)
// ============================================================================

/**
 * Classifica via Backend GDF (mock local para demonstração)
 *
 * Em produção, esta função faria uma chamada real à API do GDF
 * com modelo BERTimbau ou similar rodando no servidor.
 *
 * SIGILO: Os dados enviados ao GDF são tratados com sigilo conforme
 * a Lei de Acesso à Informação e LGPD.
 */
async function classificarComBackendGDF(
  relato: string,
  onProgress?: (progresso: number) => void
): Promise<ClassificacaoResultado | null> {
  // Verificar se está online
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.log('[IZA] Sem conexão - Backend GDF indisponível');
    return null;
  }

  console.log('[IZA] Classificando via Backend GDF (mock)...');
  onProgress?.(0.3);

  try {
    const response = await fetch('/api/ia/classificar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ relato }),
    });

    onProgress?.(0.8);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    onProgress?.(1);

    return {
      tipo: data.tipo,
      orgao: data.orgao,
      entidades: data.entidades || { locais: [], datas: [], orgaosMencionados: [] },
      resumo: data.resumo || '',
      meta: {
        fonte: 'backend_gdf',
        processadoEm: new Date(),
        tempoProcessamento: data.meta?.tempoProcessamento || 0,
        editadoPeloUsuario: false,
      },
    };

  } catch (error) {
    console.warn('[IZA] Erro no Backend GDF:', error);
    onProgress?.(1);
    return null;
  }
}

// ============================================================================
// Engine Principal
// ============================================================================

/**
 * Classifica uma manifestação usando a melhor camada disponível
 *
 * Ordem de prioridade:
 * 1. Backend GDF (se disponível e autorizado)
 * 2. Regras (sempre disponível, fallback garantido)
 *
 * IMPORTANTE: Este sistema foi projetado com privacidade como prioridade.
 * - Camada 1: Dados NUNCA saem do dispositivo
 * - Camada 2: Dados vão apenas para servidores do GDF (HTTPS + LGPD)
 */
export async function classificar(
  relato: string,
  opcoes: OpcoesClassificacao = {}
): Promise<ClassificacaoResultado> {
  const { usarBackendGDF = false, onProgress } = opcoes;

  // Reportar início
  onProgress?.(0);

  // 1. Sempre começar com regras (instantâneo)
  const resultadoRegras = classificarPorRegras(relato);
  onProgress?.(0.2);

  // 2. Se backend GDF disponível e autorizado
  if (
    usarBackendGDF &&
    configAtual.backendGDFDisponivel &&
    configAtual.usarBackendGDF &&
    typeof navigator !== 'undefined' &&
    navigator.onLine
  ) {
    try {
      const resultadoBackend = await classificarComBackendGDF(
        relato,
        (p) => onProgress?.(0.2 + p * 0.8)
      );

      if (resultadoBackend) {
        onProgress?.(1);
        return mergeResultados(resultadoBackend, resultadoRegras);
      }
    } catch (error) {
      console.warn('[IZA] Erro no backend GDF, usando fallback:', error);
    }
  }

  // 3. Fallback: usar resultado das regras
  onProgress?.(1);
  return resultadoRegras;
}

/**
 * Combina resultados de duas fontes, priorizando a primeira
 * mas usando entidades da segunda se faltarem
 */
function mergeResultados(
  principal: ClassificacaoResultado,
  fallback: ClassificacaoResultado
): ClassificacaoResultado {
  return {
    ...principal,
    entidades: {
      locais: principal.entidades.locais.length > 0
        ? principal.entidades.locais
        : fallback.entidades.locais,
      datas: principal.entidades.datas.length > 0
        ? principal.entidades.datas
        : fallback.entidades.datas,
      orgaosMencionados: principal.entidades.orgaosMencionados.length > 0
        ? principal.entidades.orgaosMencionados
        : fallback.entidades.orgaosMencionados,
    },
  };
}

// ============================================================================
// Configuração
// ============================================================================

/**
 * Obtém a configuração atual de IA
 */
export function getConfigIA(): ConfiguracaoIA {
  return { ...configAtual };
}

/**
 * Atualiza a configuração de IA
 */
export function setConfigIA(config: Partial<ConfiguracaoIA>): void {
  configAtual = { ...configAtual, ...config };
}

/**
 * Reseta a configuração para o padrão
 */
export function resetConfigIA(): void {
  configAtual = { ...configPadrao };
}

/**
 * Retorna qual camada será usada com a configuração atual
 */
export function getCamadaAtiva(): CamadaClassificacao {
  if (
    configAtual.backendGDFDisponivel &&
    configAtual.usarBackendGDF &&
    typeof navigator !== 'undefined' &&
    navigator.onLine
  ) {
    return 'backend_gdf';
  }

  return 'regras';
}

// ============================================================================
// Re-exportações
// ============================================================================

export { classificarPorRegras, classificacaoConfiavel, nivelConfianca } from './rules-engine';
export * from './types';
export {
  TIPOS_MANIFESTACAO,
  ORGAOS,
  getTipoMeta,
  getOrgaoMeta,
  artigoTipo,
} from './keywords';
