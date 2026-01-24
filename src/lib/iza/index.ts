/**
 * IZA Inteligente - Sistema de Classificação com Privacidade
 *
 * Este módulo implementa um sistema de classificação automática
 * de manifestações com foco em privacidade do cidadão.
 *
 * Arquitetura de 3 Camadas:
 * - Camada 1 (Regras): 100% local, instantâneo, sempre disponível
 * - Camada 2 (Modelo Local): IA no browser via Transformers.js
 * - Camada 3 (Backend GDF): Especificação para implementação futura
 *
 * @example
 * ```typescript
 * import { classificar, getCamadaAtiva } from '@/lib/iza';
 *
 * const resultado = await classificar(relato);
 * console.log(resultado.tipo.id); // 'reclamacao'
 * console.log(resultado.orgao.id); // 'saude'
 * console.log(getCamadaAtiva()); // 'regras'
 * ```
 */

// Engine principal
export {
  classificar,
  classificarPorRegras,
  classificacaoConfiavel,
  nivelConfianca,
  modeloLocalPronto,
  baixarModeloLocal,
  getConfigIA,
  setConfigIA,
  resetConfigIA,
  getCamadaAtiva,
} from './engine';

// Tipos
export type {
  ClassificacaoResultado,
  EntidadesExtraidas,
  ClassificacaoMeta,
  TipoManifestacaoId,
  OrgaoId,
  CamadaClassificacao,
  ConfiguracaoIA,
  OpcoesClassificacao,
  EstadoClassificacao,
  AcoesClassificacao,
  StatusModeloLocal,
  ProgressoDownload,
  TipoConsentimento,
  StatusConsentimento,
} from './types';

// Metadados e helpers
export {
  TIPOS_MANIFESTACAO,
  ORGAOS,
  getTipoMeta,
  getOrgaoMeta,
  artigoTipo,
} from './keywords';

// Tipos auxiliares dos metadados
export type { TipoManifestacaoMeta, OrgaoMeta } from './keywords';
