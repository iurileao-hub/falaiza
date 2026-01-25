/**
 * Script de teste completo para avaliar a Camada 1 (Regras)
 * 10 textos variados para identificar padrões de melhoria
 * Executa: npx tsx scripts/testar-camada1-completo.ts
 */

import { classificarPorRegras } from '../src/lib/iza/rules-engine';

interface TesteCase {
  id: number;
  nome: string;
  esperado: { tipo: string; orgao: string };
  texto: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
}

const textos: TesteCase[] = [
  // ========== FÁCEIS (linguagem clara, palavras-chave óbvias) ==========
  {
    id: 1,
    nome: 'Reclamação clara - Transporte',
    esperado: { tipo: 'reclamacao', orgao: 'transporte' },
    dificuldade: 'facil',
    texto: 'Venho reclamar do serviço de ônibus da linha 0.110. Esperei mais de 40 minutos no ponto da W3 Sul e o ônibus não passou. O DFTrans precisa fiscalizar melhor as empresas de ônibus.'
  },
  {
    id: 2,
    nome: 'Elogio claro - Saúde',
    esperado: { tipo: 'elogio', orgao: 'saude' },
    dificuldade: 'facil',
    texto: 'Quero elogiar o atendimento que recebi no Hospital Regional de Taguatinga. Os médicos e enfermeiros foram muito atenciosos e competentes. Parabéns à equipe de saúde!'
  },
  {
    id: 3,
    nome: 'Solicitação clara - Documentos',
    esperado: { tipo: 'solicitacao', orgao: 'documentos' },
    dificuldade: 'facil',
    texto: 'Gostaria de solicitar informações sobre como tirar a segunda via da minha carteira de identidade. Preciso saber quais documentos levar e qual o posto mais próximo do Guará.'
  },

  // ========== MÉDIOS (alguma ambiguidade ou linguagem menos formal) ==========
  {
    id: 4,
    nome: 'Denúncia - Segurança (com contexto urbano)',
    esperado: { tipo: 'denuncia', orgao: 'seguranca' },
    dificuldade: 'medio',
    texto: 'Tem um terreno abandonado na QNL 15 de Taguatinga que virou ponto de uso de drogas. Os moradores estão com medo porque toda noite aparecem pessoas estranhas. O mato está alto e os postes estão quebrados.'
  },
  {
    id: 5,
    nome: 'Reclamação - Saneamento (bueiro/esgoto)',
    esperado: { tipo: 'reclamacao', orgao: 'saneamento' },
    dificuldade: 'medio',
    texto: 'Tem um bueiro aberto na rua da minha casa em Sobradinho há mais de 3 meses. O esgoto está vazando e o cheiro é insuportável. Já liguei para a Caesb várias vezes e ninguém aparece.'
  },
  {
    id: 6,
    nome: 'Sugestão - Educação',
    esperado: { tipo: 'sugestao', orgao: 'educacao' },
    dificuldade: 'medio',
    texto: 'Sugiro que as escolas públicas do DF ofereçam aulas de reforço no contraturno para alunos com dificuldade. Meu filho estuda na escola classe do Recanto das Emas e precisa de mais apoio em matemática.'
  },

  // ========== DIFÍCEIS (linguagem muito informal, abreviações, ambíguos) ==========
  {
    id: 7,
    nome: 'Reclamação informal - Saúde (abreviações)',
    esperado: { tipo: 'reclamacao', orgao: 'saude' },
    dificuldade: 'dificil',
    texto: 'minha mae ta com 78 anos e faz 6 meses q ela ta na fila pra fazer uma cirurgia de catarata la no hospital de base so q toda vez q a gente liga la eles falam q ainda nao tem previsao isso eh um absurdo pq ela ja nao enxerga quase nada'
  },
  {
    id: 8,
    nome: 'Denúncia informal - Meio Ambiente',
    esperado: { tipo: 'denuncia', orgao: 'meio-ambiente' },
    dificuldade: 'dificil',
    texto: 'to denunciando uma empresa aqui perto do lago norte q ta jogando lixo e entulho numa area de preservacao ambiental. ja vi caminhao despejando coisa la varias vezes. isso ta destruindo a natureza e ngm faz nada'
  },
  {
    id: 9,
    nome: 'Reclamação ambígua - Obras vs Transporte',
    esperado: { tipo: 'reclamacao', orgao: 'obras' },
    dificuldade: 'dificil',
    texto: 'A rua principal de Samambaia está cheia de buracos enormes. Meu carro já estragou a suspensão por causa disso. Faz mais de um ano que prometeram asfaltar e nada. Os carros desviam e quase causam acidentes.'
  },
  {
    id: 10,
    nome: 'Informação/Dúvida - Assistência Social',
    esperado: { tipo: 'informacao', orgao: 'assistencia-social' },
    dificuldade: 'dificil',
    texto: 'boa tarde gostaria de saber como faço pra me cadastrar no bolsa familia e no cras aqui de ceilandia. perdi meu emprego e to precisando de ajuda pra minha familia. tenho 3 filhos pequenos e a situacao ta dificil'
  }
];

console.log('='.repeat(80));
console.log('AVALIAÇÃO COMPLETA DA CAMADA 1 - 10 CASOS DE TESTE');
console.log('='.repeat(80));

interface Resultado {
  id: number;
  nome: string;
  dificuldade: string;
  tipoEsperado: string;
  tipoObtido: string;
  tipoConfianca: number;
  tipoCorreto: boolean;
  orgaoEsperado: string;
  orgaoObtido: string;
  orgaoConfianca: number;
  orgaoCorreto: boolean;
}

const resultados: Resultado[] = [];

textos.forEach((t) => {
  const resultado = classificarPorRegras(t.texto);

  const tipoCorreto = resultado.tipo.id === t.esperado.tipo;
  const orgaoCorreto = resultado.orgao.id === t.esperado.orgao;

  resultados.push({
    id: t.id,
    nome: t.nome,
    dificuldade: t.dificuldade,
    tipoEsperado: t.esperado.tipo,
    tipoObtido: resultado.tipo.id,
    tipoConfianca: resultado.tipo.confianca,
    tipoCorreto,
    orgaoEsperado: t.esperado.orgao,
    orgaoObtido: resultado.orgao.id,
    orgaoConfianca: resultado.orgao.confianca,
    orgaoCorreto,
  });

  console.log();
  console.log('-'.repeat(80));
  console.log(`[${t.id}] ${t.nome} (${t.dificuldade.toUpperCase()})`);
  console.log('-'.repeat(80));
  console.log('Texto:', t.texto.substring(0, 100) + (t.texto.length > 100 ? '...' : ''));
  console.log();
  console.log(`TIPO:   ${tipoCorreto ? '✅' : '❌'} Esperado: ${t.esperado.tipo.padEnd(12)} | Obtido: ${resultado.tipo.id.padEnd(12)} (${Math.round(resultado.tipo.confianca * 100)}%)`);
  console.log(`ÓRGÃO:  ${orgaoCorreto ? '✅' : '❌'} Esperado: ${t.esperado.orgao.padEnd(12)} | Obtido: ${resultado.orgao.id.padEnd(12)} (${Math.round(resultado.orgao.confianca * 100)}%)`);

  if (resultado.entidades.locais.length > 0 || resultado.entidades.orgaosMencionados.length > 0) {
    console.log(`ENTIDADES: Locais: [${resultado.entidades.locais.join(', ')}] | Órgãos: [${resultado.entidades.orgaosMencionados.join(', ')}]`);
  }
});

// Estatísticas
console.log();
console.log('='.repeat(80));
console.log('ESTATÍSTICAS');
console.log('='.repeat(80));

const tiposCorretos = resultados.filter(r => r.tipoCorreto).length;
const orgaosCorretos = resultados.filter(r => r.orgaoCorreto).length;
const ambosCorretos = resultados.filter(r => r.tipoCorreto && r.orgaoCorreto).length;

console.log();
console.log('GERAL:');
console.log(`  Tipos corretos:  ${tiposCorretos}/${resultados.length} (${Math.round(tiposCorretos/resultados.length*100)}%)`);
console.log(`  Órgãos corretos: ${orgaosCorretos}/${resultados.length} (${Math.round(orgaosCorretos/resultados.length*100)}%)`);
console.log(`  Ambos corretos:  ${ambosCorretos}/${resultados.length} (${Math.round(ambosCorretos/resultados.length*100)}%)`);

// Por dificuldade
const porDificuldade = ['facil', 'medio', 'dificil'].map(d => {
  const casos = resultados.filter(r => r.dificuldade === d);
  const tipos = casos.filter(r => r.tipoCorreto).length;
  const orgaos = casos.filter(r => r.orgaoCorreto).length;
  return { dificuldade: d, total: casos.length, tipos, orgaos };
});

console.log();
console.log('POR DIFICULDADE:');
porDificuldade.forEach(d => {
  console.log(`  ${d.dificuldade.toUpperCase().padEnd(7)}: Tipos ${d.tipos}/${d.total} | Órgãos ${d.orgaos}/${d.total}`);
});

// Erros detalhados
console.log();
console.log('ERROS DETALHADOS:');
const erros = resultados.filter(r => !r.tipoCorreto || !r.orgaoCorreto);
if (erros.length === 0) {
  console.log('  Nenhum erro! 🎉');
} else {
  erros.forEach(e => {
    const problemas = [];
    if (!e.tipoCorreto) problemas.push(`Tipo: ${e.tipoEsperado} → ${e.tipoObtido}`);
    if (!e.orgaoCorreto) problemas.push(`Órgão: ${e.orgaoEsperado} → ${e.orgaoObtido}`);
    console.log(`  [${e.id}] ${e.nome}: ${problemas.join(' | ')}`);
  });
}

// Análise de padrões
console.log();
console.log('='.repeat(80));
console.log('ANÁLISE DE PADRÕES PARA MELHORIAS');
console.log('='.repeat(80));

// Tipos mais confundidos
const confusoesTipo = new Map<string, Map<string, number>>();
resultados.filter(r => !r.tipoCorreto).forEach(r => {
  const key = r.tipoEsperado;
  if (!confusoesTipo.has(key)) confusoesTipo.set(key, new Map());
  const m = confusoesTipo.get(key)!;
  m.set(r.tipoObtido, (m.get(r.tipoObtido) || 0) + 1);
});

if (confusoesTipo.size > 0) {
  console.log();
  console.log('CONFUSÕES DE TIPO (esperado → obtido):');
  confusoesTipo.forEach((v, k) => {
    v.forEach((count, obtido) => {
      console.log(`  ${k} → ${obtido} (${count}x)`);
    });
  });
}

// Órgãos mais confundidos
const confusoesOrgao = new Map<string, Map<string, number>>();
resultados.filter(r => !r.orgaoCorreto).forEach(r => {
  const key = r.orgaoEsperado;
  if (!confusoesOrgao.has(key)) confusoesOrgao.set(key, new Map());
  const m = confusoesOrgao.get(key)!;
  m.set(r.orgaoObtido, (m.get(r.orgaoObtido) || 0) + 1);
});

if (confusoesOrgao.size > 0) {
  console.log();
  console.log('CONFUSÕES DE ÓRGÃO (esperado → obtido):');
  confusoesOrgao.forEach((v, k) => {
    v.forEach((count, obtido) => {
      console.log(`  ${k} → ${obtido} (${count}x)`);
    });
  });
}

console.log();
console.log('='.repeat(80));
