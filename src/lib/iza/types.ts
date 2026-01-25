/**
 * Tipos TypeScript para a IZA Inteligente
 * Sistema de classificação automática de manifestações com privacidade
 *
 * Arquitetura de 2 Camadas:
 * - Camada 1 (Regras): 100% local, instantâneo
 * - Camada 2 (Backend GDF): API transparente
 *
 * Decisão arquitetural: ADR-001 (docs/decisions/2026-01-25-remocao-modelo-local.md)
 */

// ============================================================================
// Tipos de Classificação
// ============================================================================

/**
 * Resultado da classificação de uma manifestação
 */
export interface ClassificacaoResultado {
  /** Tipo da manifestação identificado */
  tipo: {
    id: TipoManifestacaoId;
    confianca: number; // 0-1
  };

  /** Órgão/área responsável identificado */
  orgao: {
    id: OrgaoId;
    confianca: number; // 0-1
  };

  /** Entidades extraídas do relato */
  entidades: EntidadesExtraidas;

  /** Resumo gerado do relato */
  resumo: string;

  /** Metadados da classificação */
  meta: ClassificacaoMeta;
}

/**
 * Entidades extraídas do texto do relato
 */
export interface EntidadesExtraidas {
  /** Locais mencionados (RAs, endereços, órgãos) */
  locais: string[];

  /** Datas mencionadas */
  datas: string[];

  /** Órgãos específicos mencionados */
  orgaosMencionados: string[];
}

/**
 * Metadados sobre como a classificação foi feita
 */
export interface ClassificacaoMeta {
  /** Qual camada foi usada para classificar */
  fonte: CamadaClassificacao;

  /** Quando foi processado */
  processadoEm: Date;

  /** Tempo de processamento em ms */
  tempoProcessamento: number;

  /** Se o usuário editou a classificação */
  editadoPeloUsuario: boolean;
}

// ============================================================================
// Enums e IDs
// ============================================================================

/**
 * Tipos de manifestação disponíveis
 */
export type TipoManifestacaoId =
  | 'reclamacao'
  | 'denuncia'
  | 'sugestao'
  | 'elogio'
  | 'solicitacao'
  | 'informacao';

/**
 * Órgãos/áreas disponíveis para classificação
 */
export type OrgaoId =
  | 'saude'
  | 'educacao'
  | 'transporte'
  | 'seguranca'
  | 'obras'
  | 'saneamento'
  | 'meio-ambiente'
  | 'documentos'
  | 'assistencia-social'
  | 'outro';

/**
 * Camadas de classificação disponíveis
 */
export type CamadaClassificacao =
  | 'regras'       // Camada 1: Classificação por palavras-chave (local)
  | 'backend_gdf'; // Camada 2: API do GDF (servidor)

// ============================================================================
// Configuração de IA
// ============================================================================

/**
 * Configuração das preferências de IA
 */
export interface ConfiguracaoIA {
  /** Se o backend GDF está disponível */
  backendGDFDisponivel: boolean;

  /** Se deve usar o backend GDF quando disponível */
  usarBackendGDF: boolean;
}

/**
 * Opções para o processo de classificação
 */
export interface OpcoesClassificacao {
  /** Usar backend GDF se disponível */
  usarBackendGDF?: boolean;

  /** Callback de progresso (0-1) */
  onProgress?: (progresso: number) => void;
}

// ============================================================================
// Regras de Classificação
// ============================================================================

/**
 * Regra de classificação por palavras-chave
 */
export interface RegraClassificacao {
  /** Peso da regra (maior = mais específico) */
  peso: number;

  /** Palavras-chave individuais */
  palavras: string[];

  /** Frases completas (match mais forte) */
  frases: string[];
}

/**
 * Mapa de regras por tipo de manifestação
 */
export type RegrasTipo = Record<TipoManifestacaoId, RegraClassificacao>;

/**
 * Regra de classificação de órgão
 */
export interface RegraOrgao {
  /** Palavras-chave do órgão */
  palavras: string[];

  /** Entidades específicas (siglas, nomes de unidades) */
  entidades: string[];
}

/**
 * Mapa de regras por órgão
 */
export type RegrasOrgao = Record<OrgaoId, RegraOrgao>;

// ============================================================================
// Extração de Entidades
// ============================================================================

/**
 * Configuração de extratores de entidades
 */
export interface ExtratoresEntidades {
  /** Regex para extrair locais (RAs do DF) */
  locais: RegExp;

  /** Regex para extrair datas */
  datas: RegExp;

  /** Regex para extrair órgãos específicos */
  orgaos: RegExp;
}

// ============================================================================
// Hooks e Estado
// ============================================================================

/**
 * Estado do hook useClassificacao
 */
export interface EstadoClassificacao {
  /** Status atual do processo */
  status: 'idle' | 'classificando' | 'sucesso' | 'erro';

  /** Resultado da classificação (se sucesso) */
  resultado: ClassificacaoResultado | null;

  /** Erro (se houver) */
  erro: Error | null;

  /** Progresso da classificação (0-1) */
  progresso: number;
}

/**
 * Ações do hook useClassificacao
 */
export interface AcoesClassificacao {
  /** Inicia o processo de classificação */
  classificar: (relato: string) => Promise<ClassificacaoResultado>;

  /** Atualiza a classificação com edições do usuário */
  atualizar: (dados: Partial<ClassificacaoResultado>) => void;

  /** Reseta o estado */
  resetar: () => void;
}
