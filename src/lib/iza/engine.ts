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
// Configuração do Engine (sem estado global mutável para compatibilidade SSR)
// ============================================================================

/** Configuração padrão de IA */
const configPadrao: ConfiguracaoIA = {
  backendGDFDisponivel: true, // Mock disponível
  usarBackendGDF: true,       // Habilitado por padrão
};

/**
 * Retorna uma cópia fresca da configuração atual.
 * Evita estado global mutável que seria compartilhado entre requests no SSR.
 */
function obterConfig(): ConfiguracaoIA {
  return { ...configPadrao };
}

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
    return null;
  }
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

  } catch {
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
  const config = obterConfig();
  if (
    usarBackendGDF &&
    config.backendGDFDisponivel &&
    config.usarBackendGDF &&
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
    } catch {
      // Silently fallback to rules engine
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
 * Obtém a configuração atual de IA (cópia fresca)
 */
export function getConfigIA(): ConfiguracaoIA {
  return obterConfig();
}

/**
 * Cria uma nova configuração mesclando com os valores padrão.
 * Retorna a configuração resultante sem mutar estado global.
 */
export function criarConfigIA(config: Partial<ConfiguracaoIA>): ConfiguracaoIA {
  return { ...configPadrao, ...config };
}

/**
 * Atualiza a configuração de IA (mantido por compatibilidade, sem efeito no SSR)
 * @deprecated Use criarConfigIA() e passe a config como parâmetro
 */
export function setConfigIA(_config: Partial<ConfiguracaoIA>): void {
  // No-op: configuração não é mais global para evitar vazamento entre requests SSR.
  // Use criarConfigIA() para obter uma configuração customizada.
}

/**
 * Reseta a configuração para o padrão (mantido por compatibilidade)
 * @deprecated Sem efeito, pois não há mais estado global mutável
 */
export function resetConfigIA(): void {
  // No-op: configuração não é mais global.
}

/**
 * Retorna qual camada será usada com a configuração padrão
 */
export function getCamadaAtiva(): CamadaClassificacao {
  const config = obterConfig();
  if (
    config.backendGDFDisponivel &&
    config.usarBackendGDF &&
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
