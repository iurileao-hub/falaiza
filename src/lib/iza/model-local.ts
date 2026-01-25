/**
 * Gerenciador do Modelo Local - Camada 2 da IZA Inteligente
 *
 * Usa MobileBERT para classificação zero-shot no browser.
 * O modelo é baixado sob demanda e cacheado localmente.
 *
 * PRIVACIDADE: 100% dos dados são processados localmente.
 * Nenhum dado é enviado para servidores externos.
 *
 * NOTA: Este módulo usa import dinâmico para evitar que o Webpack
 * tente bundlear os bindings nativos do ONNX Runtime.
 */

import type {
  TipoManifestacaoId,
  OrgaoId,
  StatusModeloLocal,
  ProgressoDownload,
  ClassificacaoResultado,
} from './types';

// Verificar se estamos no browser
const isBrowser = typeof window !== 'undefined';

// ============================================================================
// Configuração do Modelo
// ============================================================================

/** Modelo usado para classificação zero-shot */
const MODELO_ID = 'Xenova/mobilebert-uncased-mnli';

/** Tamanho aproximado do modelo em MB */
export const TAMANHO_MODELO_MB = 100;

/** Labels para classificação de tipo (em português descritivo) */
const LABELS_TIPO: Record<string, TipoManifestacaoId> = {
  'complaint about public service or government': 'reclamacao',
  'report of corruption or irregularity': 'denuncia',
  'compliment or praise for public service': 'elogio',
  'suggestion for improvement': 'sugestao',
  'request for service or assistance': 'solicitacao',
  'question or request for information': 'informacao',
};

/** Labels para classificação de órgão */
const LABELS_ORGAO: Record<string, OrgaoId> = {
  'health hospital medical clinic doctor nurse': 'saude',
  'education school university student teacher': 'educacao',
  'transportation bus metro traffic road': 'transporte',
  'security police crime safety emergency': 'seguranca',
  'construction infrastructure road building': 'obras',
  'water sanitation sewage garbage cleaning': 'saneamento',
  'environment nature park pollution': 'meio-ambiente',
  'documents registry certificate license': 'documentos',
  'social assistance welfare benefits family': 'assistencia-social',
  'other general administration government': 'outro',
};

// ============================================================================
// Estado do Modelo
// ============================================================================

interface EstadoModelo {
  status: StatusModeloLocal;
  pipeline: unknown | null;
  erro: string | null;
  progresso: ProgressoDownload | null;
}

let estado: EstadoModelo = {
  status: 'nao_disponivel',
  pipeline: null,
  erro: null,
  progresso: null,
};

// Callbacks registrados para mudanças de estado
const listeners: Set<(estado: EstadoModelo) => void> = new Set();

function notificarListeners() {
  listeners.forEach(listener => listener(estado));
}

// ============================================================================
// API Pública
// ============================================================================

/**
 * Retorna o status atual do modelo
 */
export function getStatusModelo(): StatusModeloLocal {
  return estado.status;
}

/**
 * Retorna o progresso atual do download
 */
export function getProgressoDownload(): ProgressoDownload | null {
  return estado.progresso;
}

/**
 * Verifica se o modelo está pronto para uso
 */
export function modeloEstaPronto(): boolean {
  return estado.status === 'pronto' && estado.pipeline !== null;
}

/**
 * Registra um listener para mudanças de estado
 */
export function onStatusChange(callback: (estado: EstadoModelo) => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Inicia o download do modelo
 *
 * @param onProgress - Callback chamado durante o download (0-1)
 * @returns true se o download foi bem sucedido
 */
export async function baixarModelo(
  onProgress?: (progresso: number) => void
): Promise<boolean> {
  if (estado.status === 'baixando') {
    console.warn('[IZA Model] Download já em andamento');
    return false;
  }

  if (estado.status === 'pronto') {
    console.log('[IZA Model] Modelo já está pronto');
    return true;
  }

  estado = {
    ...estado,
    status: 'baixando',
    erro: null,
    progresso: { porcentagem: 0, baixados: 0, total: TAMANHO_MODELO_MB * 1024 * 1024 },
  };
  notificarListeners();

  try {
    // Verificar se estamos no browser
    if (!isBrowser) {
      console.warn('[IZA Model] Download de modelo só funciona no browser');
      estado = { ...estado, status: 'erro', erro: 'Ambiente não suportado' };
      notificarListeners();
      return false;
    }

    console.log('[IZA Model] Iniciando download do modelo:', MODELO_ID);

    // Import dinâmico usando variável para evitar análise estática do webpack
    // @ts-expect-error - Import dinâmico com URL para evitar bundling
    const transformersModule = await import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3');
    const { pipeline, env } = transformersModule;

    // Configurar para usar cache local no browser
    env.useBrowserCache = true;
    env.allowLocalModels = false;
    env.backends.onnx.wasm.proxy = false;

    // Criar pipeline de zero-shot classification
    const classifier = await pipeline(
      'zero-shot-classification',
      MODELO_ID,
      {
        progress_callback: (progress: { progress?: number; loaded?: number; total?: number; file?: string }) => {
          if (progress.progress !== undefined) {
            const porcentagem = Math.round(progress.progress);
            estado = {
              ...estado,
              progresso: {
                porcentagem,
                baixados: progress.loaded || 0,
                total: progress.total || TAMANHO_MODELO_MB * 1024 * 1024,
                arquivoAtual: progress.file,
              },
            };
            notificarListeners();
            onProgress?.(porcentagem / 100);
          }
        },
      }
    );

    estado = {
      status: 'pronto',
      pipeline: classifier,
      erro: null,
      progresso: { porcentagem: 100, baixados: TAMANHO_MODELO_MB * 1024 * 1024, total: TAMANHO_MODELO_MB * 1024 * 1024 },
    };
    notificarListeners();
    onProgress?.(1);

    console.log('[IZA Model] Modelo carregado com sucesso');
    return true;

  } catch (error) {
    const mensagem = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('[IZA Model] Erro ao baixar modelo:', mensagem);

    estado = {
      ...estado,
      status: 'erro',
      erro: mensagem,
      progresso: null,
    };
    notificarListeners();

    return false;
  }
}

/**
 * Classifica um relato usando o modelo local
 *
 * @param relato - Texto do relato a classificar
 * @returns Resultado da classificação ou null se o modelo não estiver pronto
 */
export async function classificarComModelo(
  relato: string
): Promise<ClassificacaoResultado | null> {
  if (!modeloEstaPronto() || !estado.pipeline) {
    console.warn('[IZA Model] Modelo não está pronto para classificação');
    return null;
  }

  const inicio = performance.now();

  try {
    // Type assertion para o pipeline
    const classifier = estado.pipeline as (
      text: string,
      labels: string[],
      options?: { multi_label?: boolean }
    ) => Promise<{ labels: string[]; scores: number[] }>;

    // Classificar tipo
    const resultadoTipo = await classifier(
      relato,
      Object.keys(LABELS_TIPO),
      { multi_label: false }
    );

    // Classificar órgão
    const resultadoOrgao = await classifier(
      relato,
      Object.keys(LABELS_ORGAO),
      { multi_label: false }
    );

    const tempoProcessamento = Math.round(performance.now() - inicio);

    // Mapear labels para IDs
    const tipoLabel = resultadoTipo.labels[0];
    const orgaoLabel = resultadoOrgao.labels[0];

    const tipoId = LABELS_TIPO[tipoLabel] || 'reclamacao';
    const orgaoId = LABELS_ORGAO[orgaoLabel] || 'outro';

    console.log('[IZA Model] Classificação concluída em', tempoProcessamento, 'ms');
    console.log('[IZA Model] Tipo:', tipoId, '(', resultadoTipo.scores[0].toFixed(2), ')');
    console.log('[IZA Model] Órgão:', orgaoId, '(', resultadoOrgao.scores[0].toFixed(2), ')');

    return {
      tipo: {
        id: tipoId,
        confianca: resultadoTipo.scores[0],
      },
      orgao: {
        id: orgaoId,
        confianca: resultadoOrgao.scores[0],
      },
      entidades: {
        locais: [],
        datas: [],
        orgaosMencionados: [],
      },
      resumo: '', // Modelo não gera resumo, será preenchido pela Camada 1
      meta: {
        fonte: 'modelo_local',
        processadoEm: new Date(),
        tempoProcessamento,
        editadoPeloUsuario: false,
      },
    };

  } catch (error) {
    console.error('[IZA Model] Erro na classificação:', error);
    return null;
  }
}

/**
 * Limpa o modelo da memória (útil para liberar recursos)
 */
export function descarregarModelo(): void {
  if (estado.pipeline) {
    // O pipeline não tem método de limpeza explícito,
    // mas remover a referência permite que o GC limpe
    estado = {
      status: 'nao_disponivel',
      pipeline: null,
      erro: null,
      progresso: null,
    };
    notificarListeners();
    console.log('[IZA Model] Modelo descarregado da memória');
  }
}

/**
 * Verifica se o modelo está em cache (já foi baixado antes)
 * Nota: Transformers.js gerencia o cache automaticamente
 */
export async function verificarCache(): Promise<boolean> {
  // Transformers.js usa o Cache API do browser
  // Não temos como verificar diretamente sem tentar carregar
  // Por enquanto, retornamos false e deixamos o download verificar
  return false;
}
