/**
 * Engine Principal da IZA Inteligente
 * Orquestra as 3 camadas de classificação com foco em privacidade
 *
 * Camada 1: Regras (sempre disponível, 0 KB, instantâneo)
 * Camada 2: Modelo Local (opcional, ~50MB, alta precisão)
 * Camada 3: Backend GDF (futuro, especificação)
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
  modeloLocalDisponivel: false, // Será true quando Transformers.js estiver disponível
  modeloLocalBaixado: false,
  usarModeloLocal: false,
  backendGDFDisponivel: false, // Futuro
  usarBackendGDF: false,
};

let configAtual: ConfiguracaoIA = { ...configPadrao };

// ============================================================================
// Camada 2: Modelo Local (Placeholder)
// ============================================================================

/**
 * Placeholder para classificação com modelo local
 * Será implementado com Transformers.js
 */
async function classificarComModeloLocal(
  relato: string,
  onProgress?: (progresso: number) => void
): Promise<ClassificacaoResultado | null> {
  // TODO: Implementar com Transformers.js
  // Por enquanto, retorna null para usar fallback das regras
  console.log('[IZA] Modelo local não implementado ainda');

  if (onProgress) {
    onProgress(1);
  }

  return null;
}

/**
 * Verifica se o modelo local está pronto para uso
 */
export function modeloLocalPronto(): boolean {
  return configAtual.modeloLocalBaixado && configAtual.usarModeloLocal;
}

/**
 * Inicia o download do modelo local
 */
export async function baixarModeloLocal(
  onProgress?: (progresso: number) => void
): Promise<boolean> {
  // TODO: Implementar download do modelo Transformers.js
  console.log('[IZA] Download do modelo local não implementado ainda');

  if (onProgress) {
    // Simular progresso
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 100));
      onProgress(i / 100);
    }
  }

  // Por enquanto, marca como não disponível
  configAtual.modeloLocalBaixado = false;
  return false;
}

// ============================================================================
// Camada 3: Backend GDF (Especificação)
// ============================================================================

/**
 * Placeholder para classificação via Backend GDF
 * Documentado para implementação futura
 */
async function classificarComBackendGDF(
  relato: string,
  _onProgress?: (progresso: number) => void
): Promise<ClassificacaoResultado | null> {
  // Backend GDF não está disponível no protótipo
  // Esta função documenta a interface esperada

  console.log('[IZA] Backend GDF não disponível (especificação futura)');

  /*
  // Exemplo de implementação futura:
  const response = await fetch('/api/ia/classificar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      relato,
      privacidade: {
        consentimento: true,
        naoArmazenar: true,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao classificar via Backend GDF');
  }

  const data = await response.json();
  return {
    tipo: data.tipo,
    orgao: data.orgao,
    entidades: data.entidades,
    resumo: data.resumo.medio,
    meta: {
      fonte: 'backend_gdf',
      processadoEm: new Date(),
      tempoProcessamento: data.meta.tempoProcessamento,
      editadoPeloUsuario: false,
    },
  };
  */

  return null;
}

// ============================================================================
// Engine Principal
// ============================================================================

/**
 * Classifica uma manifestação usando a melhor camada disponível
 *
 * Ordem de prioridade:
 * 1. Modelo Local (se disponível e autorizado)
 * 2. Backend GDF (se disponível e autorizado)
 * 3. Regras (sempre disponível, fallback garantido)
 *
 * IMPORTANTE: Este sistema foi projetado com privacidade como prioridade.
 * - Camadas 1 e 2: Dados NUNCA saem do dispositivo
 * - Camada 3: Dados vão apenas para servidores do GDF
 */
export async function classificar(
  relato: string,
  opcoes: OpcoesClassificacao = {}
): Promise<ClassificacaoResultado> {
  const { usarModeloLocal = true, usarBackendGDF = false, onProgress } = opcoes;

  // Reportar início
  onProgress?.(0);

  // 1. Sempre começar com regras (instantâneo)
  const resultadoRegras = classificarPorRegras(relato);
  onProgress?.(0.2);

  // 2. Se modelo local disponível e autorizado
  if (
    usarModeloLocal &&
    configAtual.modeloLocalBaixado &&
    configAtual.usarModeloLocal
  ) {
    try {
      const resultadoLocal = await classificarComModeloLocal(
        relato,
        (p) => onProgress?.(0.2 + p * 0.6)
      );

      if (resultadoLocal && resultadoLocal.tipo.confianca > 0.7) {
        // Modelo local tem confiança alta, usar este resultado
        onProgress?.(1);
        return mergeResultados(resultadoLocal, resultadoRegras);
      }
    } catch (error) {
      console.warn('[IZA] Erro no modelo local, usando fallback:', error);
    }
  }

  // 3. Se backend GDF disponível e autorizado
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
        (p) => onProgress?.(0.2 + p * 0.6)
      );

      if (resultadoBackend) {
        onProgress?.(1);
        return mergeResultados(resultadoBackend, resultadoRegras);
      }
    } catch (error) {
      console.warn('[IZA] Erro no backend GDF, usando fallback:', error);
    }
  }

  // 4. Fallback: usar resultado das regras
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
  if (configAtual.modeloLocalBaixado && configAtual.usarModeloLocal) {
    return 'modelo_local';
  }

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
