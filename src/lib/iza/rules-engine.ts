/**
 * Engine de Classificação por Regras (Camada 1)
 * Classificação instantânea usando palavras-chave
 * 100% local, sem envio de dados, funciona offline
 */

import type {
  ClassificacaoResultado,
  TipoManifestacaoId,
  OrgaoId,
  EntidadesExtraidas,
} from './types';

import {
  REGRAS_TIPO,
  REGRAS_ORGAO,
  EXTRATORES,
  getTipoMeta,
  getOrgaoMeta,
} from './keywords';

// ============================================================================
// Configuração
// ============================================================================

/** Confiança mínima para considerar uma classificação válida */
const CONFIANCA_MINIMA = 0.3;

/** Peso adicional para frases completas vs palavras individuais */
const PESO_FRASE = 2.0;

/** Máximo de caracteres para o resumo */
const MAX_RESUMO = 150;

// ============================================================================
// Funções de Normalização
// ============================================================================

/**
 * Normaliza texto para comparação
 * Remove acentos, converte para minúsculas
 */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================================
// Classificação de Tipo
// ============================================================================

interface ScoreTipo {
  id: TipoManifestacaoId;
  score: number;
  matchesPalavras: number;
  matchesFrases: number;
}

/**
 * Classifica o tipo de manifestação baseado em palavras-chave
 */
function classificarTipo(texto: string): { id: TipoManifestacaoId; confianca: number } {
  const textoNormalizado = normalizar(texto);
  const scores: ScoreTipo[] = [];

  for (const [tipoId, regra] of Object.entries(REGRAS_TIPO)) {
    let score = 0;
    let matchesPalavras = 0;
    let matchesFrases = 0;

    // Verificar palavras individuais
    for (const palavra of regra.palavras) {
      const palavraNormalizada = normalizar(palavra);
      if (textoNormalizado.includes(palavraNormalizada)) {
        score += regra.peso;
        matchesPalavras++;
      }
    }

    // Verificar frases completas (peso maior)
    for (const frase of regra.frases) {
      const fraseNormalizada = normalizar(frase);
      if (textoNormalizado.includes(fraseNormalizada)) {
        score += regra.peso * PESO_FRASE;
        matchesFrases++;
      }
    }

    scores.push({
      id: tipoId as TipoManifestacaoId,
      score,
      matchesPalavras,
      matchesFrases,
    });
  }

  // Ordenar por score
  scores.sort((a, b) => b.score - a.score);

  // Calcular confiança normalizada
  const melhor = scores[0];
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

  // Se não houver nenhum match, retornar 'informacao' com baixa confiança
  if (totalScore === 0) {
    return { id: 'informacao', confianca: 0.1 };
  }

  const confianca = Math.min(melhor.score / totalScore, 0.99);

  return {
    id: melhor.id,
    confianca: Math.max(confianca, CONFIANCA_MINIMA),
  };
}

// ============================================================================
// Classificação de Órgão
// ============================================================================

interface ScoreOrgao {
  id: OrgaoId;
  score: number;
  matchesPalavras: number;
  matchesEntidades: number;
}

/**
 * Classifica o órgão/área responsável baseado em palavras-chave
 */
function classificarOrgao(texto: string): { id: OrgaoId; confianca: number } {
  const textoNormalizado = normalizar(texto);
  const textoOriginal = texto.toLowerCase(); // Mantém acentos para entidades
  const scores: ScoreOrgao[] = [];

  for (const [orgaoId, regra] of Object.entries(REGRAS_ORGAO)) {
    let score = 0;
    let matchesPalavras = 0;
    let matchesEntidades = 0;

    // Verificar palavras-chave
    for (const palavra of regra.palavras) {
      const palavraNormalizada = normalizar(palavra);
      if (textoNormalizado.includes(palavraNormalizada)) {
        score += 1;
        matchesPalavras++;
      }
    }

    // Verificar entidades específicas (peso maior)
    for (const entidade of regra.entidades) {
      if (textoOriginal.includes(entidade.toLowerCase())) {
        score += 3; // Entidades são mais específicas
        matchesEntidades++;
      }
    }

    scores.push({
      id: orgaoId as OrgaoId,
      score,
      matchesPalavras,
      matchesEntidades,
    });
  }

  // Ordenar por score
  scores.sort((a, b) => b.score - a.score);

  // Calcular confiança normalizada
  const melhor = scores[0];
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

  // Se não houver nenhum match, retornar 'outro' com baixa confiança
  if (totalScore === 0) {
    return { id: 'outro', confianca: 0.1 };
  }

  const confianca = Math.min(melhor.score / totalScore, 0.99);

  return {
    id: melhor.id,
    confianca: Math.max(confianca, CONFIANCA_MINIMA),
  };
}

// ============================================================================
// Extração de Entidades
// ============================================================================

/**
 * Extrai entidades do texto usando regex
 */
function extrairEntidades(texto: string): EntidadesExtraidas {
  const locais: string[] = [];
  const datas: string[] = [];
  const orgaosMencionados: string[] = [];

  // Extrair locais (RAs)
  const matchesLocais = texto.match(EXTRATORES.locais);
  if (matchesLocais) {
    // Remover duplicatas e normalizar
    const locaisUnicos = Array.from(new Set(matchesLocais.map(l => l.trim())));
    locais.push(...locaisUnicos);
  }

  // Extrair datas
  const matchesDatas = texto.match(EXTRATORES.datas);
  if (matchesDatas) {
    const datasUnicas = Array.from(new Set(matchesDatas.map(d => d.trim())));
    datas.push(...datasUnicas);
  }

  // Extrair órgãos específicos
  const matchesOrgaos = texto.match(EXTRATORES.orgaos);
  if (matchesOrgaos) {
    const orgaosUnicos = Array.from(new Set(matchesOrgaos.map(o => o.trim())));
    orgaosMencionados.push(...orgaosUnicos);
  }

  return {
    locais,
    datas,
    orgaosMencionados,
  };
}

// ============================================================================
// Geração de Resumo
// ============================================================================

/**
 * Gera um resumo do relato baseado na classificação
 */
function gerarResumo(
  texto: string,
  tipo: TipoManifestacaoId,
  orgao: OrgaoId,
  entidades: EntidadesExtraidas
): string {
  const tipoMeta = getTipoMeta(tipo);
  const orgaoMeta = getOrgaoMeta(orgao);

  const tipoNome = tipoMeta?.nome || 'Manifestação';
  const orgaoNome = orgaoMeta?.nome || 'órgão não identificado';

  // Extrair primeira frase significativa do texto
  const frases = texto
    .split(/[.!?]/)
    .map(f => f.trim())
    .filter(f => f.length >= 10);

  const primeiraFrase = frases[0] || texto;
  const fraseResumida = primeiraFrase.length > 80
    ? primeiraFrase.slice(0, 77) + '...'
    : primeiraFrase;

  // Construir resumo
  let resumo = `${tipoNome} sobre ${orgaoNome}`;

  // Adicionar local se identificado
  if (entidades.locais.length > 0) {
    resumo += ` em ${entidades.locais[0]}`;
  }

  // Adicionar fragmento do texto
  resumo += `: "${fraseResumida}"`;

  // Limitar tamanho
  if (resumo.length > MAX_RESUMO) {
    resumo = resumo.slice(0, MAX_RESUMO - 3) + '..."';
  }

  return resumo;
}

// ============================================================================
// API Pública
// ============================================================================

/**
 * Classifica uma manifestação usando o sistema de regras (Camada 1)
 *
 * Esta função é 100% local:
 * - Não envia dados para nenhum servidor
 * - Funciona offline
 * - Execução instantânea (< 50ms)
 *
 * @param relato - Texto do relato da manifestação
 * @returns Resultado da classificação
 */
export function classificarPorRegras(relato: string): ClassificacaoResultado {
  const inicio = performance.now();

  // Classificar tipo
  const tipo = classificarTipo(relato);

  // Classificar órgão
  const orgao = classificarOrgao(relato);

  // Extrair entidades
  const entidades = extrairEntidades(relato);

  // Gerar resumo
  const resumo = gerarResumo(relato, tipo.id, orgao.id, entidades);

  const fim = performance.now();

  return {
    tipo,
    orgao,
    entidades,
    resumo,
    meta: {
      fonte: 'regras',
      processadoEm: new Date(),
      tempoProcessamento: Math.round(fim - inicio),
      editadoPeloUsuario: false,
    },
  };
}

/**
 * Verifica se a classificação tem confiança suficiente
 */
export function classificacaoConfiavel(resultado: ClassificacaoResultado): boolean {
  return resultado.tipo.confianca >= 0.5 && resultado.orgao.confianca >= 0.5;
}

/**
 * Retorna o nível de confiança como texto
 */
export function nivelConfianca(confianca: number): 'alta' | 'media' | 'baixa' {
  if (confianca >= 0.8) return 'alta';
  if (confianca >= 0.5) return 'media';
  return 'baixa';
}
