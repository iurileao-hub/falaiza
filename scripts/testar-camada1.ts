/**
 * Script de teste para avaliar a Camada 1 (Regras)
 * Executa: npx tsx scripts/testar-camada1.ts
 */

import { classificarPorRegras } from '../src/lib/iza/rules-engine';

interface TesteCase {
  nome: string;
  esperado: { tipo: string; orgao: string };
  texto: string;
}

const textos: TesteCase[] = [
  {
    nome: 'Teste 1: Linguagem Clara (Transporte)',
    esperado: { tipo: 'reclamacao', orgao: 'transporte' },
    texto: 'Venho reclamar do serviço de ônibus da linha 0.110 que passa na Asa Norte. Ontem, dia 22/01/2026, esperei mais de 40 minutos no ponto da W3 Sul e o ônibus simplesmente não passou. Isso acontece toda semana. O DFTrans precisa fiscalizar melhor as empresas de ônibus. Já perdi emprego por causa de atraso.'
  },
  {
    nome: 'Teste 2: Linguagem Ambígua (Segurança)',
    esperado: { tipo: 'denuncia', orgao: 'seguranca' },
    texto: 'Tem um terreno abandonado aqui na QNL 15 de Taguatinga que virou ponto de uso de drogas. Os moradores estão com medo porque toda noite aparecem pessoas estranhas. O mato está alto, tem muito lixo acumulado e os postes de luz estão todos quebrados. A gente já ligou várias vezes mas ninguém resolve.'
  },
  {
    nome: 'Teste 3: Linguagem Coloquial (Saúde)',
    esperado: { tipo: 'reclamacao', orgao: 'saude' },
    texto: 'minha mae ta com 78 anos e faz 6 meses q ela ta na fila pra fazer uma cirurgia de catarata la no hospital de base so q toda vez q a gente liga la eles falam q ainda nao tem previsao isso eh um absurdo pq ela ja nao enxerga quase nada e pode cair a qualqer momento ja levei ela no upa do gama 3 vezes e so dao remedio pra dor nao resolve nd'
  }
];

console.log('='.repeat(70));
console.log('AVALIAÇÃO DA CAMADA 1 - CLASSIFICAÇÃO POR REGRAS');
console.log('='.repeat(70));

let acertos = 0;
let total = textos.length * 2; // tipo + órgão para cada teste

textos.forEach((t) => {
  const resultado = classificarPorRegras(t.texto);

  const tipoCorreto = resultado.tipo.id === t.esperado.tipo;
  const orgaoCorreto = resultado.orgao.id === t.esperado.orgao;

  if (tipoCorreto) acertos++;
  if (orgaoCorreto) acertos++;

  console.log();
  console.log('-'.repeat(70));
  console.log(t.nome);
  console.log('-'.repeat(70));
  console.log('Texto:', t.texto.substring(0, 80) + '...');
  console.log();
  console.log('TIPO:');
  console.log('  Esperado:', t.esperado.tipo);
  console.log('  Obtido:  ', resultado.tipo.id, '(' + Math.round(resultado.tipo.confianca * 100) + '%)');
  console.log('  Status:  ', tipoCorreto ? '✅ CORRETO' : '❌ INCORRETO');
  console.log();
  console.log('ÓRGÃO:');
  console.log('  Esperado:', t.esperado.orgao);
  console.log('  Obtido:  ', resultado.orgao.id, '(' + Math.round(resultado.orgao.confianca * 100) + '%)');
  console.log('  Status:  ', orgaoCorreto ? '✅ CORRETO' : '❌ INCORRETO');
  console.log();
  console.log('Entidades:', JSON.stringify(resultado.entidades));
  console.log('Tempo:', resultado.meta.tempoProcessamento + 'ms');
});

console.log();
console.log('='.repeat(70));
console.log('RESUMO: ' + acertos + '/' + total + ' classificações corretas (' + Math.round(acertos/total*100) + '%)');
console.log('='.repeat(70));
