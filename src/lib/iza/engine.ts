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
import {
  modeloEstaPronto,
  classificarComModelo,
  baixarModelo as baixarModeloLocal,
  getStatusModelo,
  getProgressoDownload,
  onStatusChange,
  TAMANHO_MODELO_MB,
} from './model-local';

// ============================================================================
// Estado Global do Engine
// ============================================================================

/** Configuração padrão de IA */
const configPadrao: ConfiguracaoIA = {
  modeloLocalDisponivel: true, // Transformers.js está disponível
  modeloLocalBaixado: false,   // Será atualizado quando o modelo for baixado
  usarModeloLocal: true,       // Habilitado por padrão
  backendGDFDisponivel: true,  // Mock disponível
  usarBackendGDF: true,        // Habilitado por padrão
};

let configAtual: ConfiguracaoIA = { ...configPadrao };

// Sincronizar estado do modelo local com a configuração
onStatusChange((estado) => {
  configAtual.modeloLocalBaixado = estado.status === 'pronto';
});

// ============================================================================
// Camada 2: Modelo Local (MobileBERT via Transformers.js)
// ============================================================================

/**
 * Classifica usando o modelo local MobileBERT
 * Zero-shot classification - não requer treino específico
 *
 * PRIVACIDADE: Dados processados 100% localmente
 */
async function classificarComModeloLocal(
  relato: string,
  onProgress?: (progresso: number) => void
): Promise<ClassificacaoResultado | null> {
  if (!modeloEstaPronto()) {
    console.log('[IZA] Modelo local não está pronto');
    onProgress?.(1);
    return null;
  }

  console.log('[IZA] Classificando com modelo local...');
  onProgress?.(0.3);

  const resultado = await classificarComModelo(relato);

  onProgress?.(1);
  return resultado;
}

/**
 * Verifica se o modelo local está pronto para uso
 */
export function modeloLocalPronto(): boolean {
  return modeloEstaPronto() && configAtual.usarModeloLocal;
}

/**
 * Inicia o download do modelo local MobileBERT
 *
 * @param onProgress - Callback de progresso (0-1)
 * @returns true se download bem sucedido
 */
export async function baixarModelo(
  onProgress?: (progresso: number) => void
): Promise<boolean> {
  console.log('[IZA] Iniciando download do modelo local...');

  const sucesso = await baixarModeloLocal(onProgress);

  if (sucesso) {
    configAtual.modeloLocalBaixado = true;
    console.log('[IZA] Modelo local pronto para uso');
  }

  return sucesso;
}

/**
 * Retorna informações sobre o modelo local
 */
export function getInfoModeloLocal() {
  return {
    status: getStatusModelo(),
    progresso: getProgressoDownload(),
    tamanhoMB: TAMANHO_MODELO_MB,
    pronto: modeloEstaPronto(),
  };
}

// ============================================================================
// Camada 3: Backend GDF (Mock para demonstração)
// ============================================================================

/**
 * Classifica via Backend GDF (mock local para demonstração)
 *
 * Em produção, esta função faria uma chamada real à API do GDF.
 * O mock simula o comportamento esperado para validação da arquitetura.
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
export {
  TAMANHO_MODELO_MB,
  getStatusModelo,
  getProgressoDownload,
  onStatusChange,
  descarregarModelo,
} from './model-local';
