/**
 * API Mock - Backend GDF para Classificação de Manifestações
 *
 * Esta é uma implementação mock que simula o comportamento esperado
 * de uma API real do GDF para classificação inteligente.
 *
 * Em produção, esta rota seria substituída por uma integração real
 * com os sistemas de IA do Governo do Distrito Federal.
 *
 * SIGILO: Os dados recebidos são tratados com sigilo.
 * Nenhum dado é armazenado permanentemente neste mock.
 */

import { NextRequest, NextResponse } from 'next/server';
import { classificarPorRegras } from '@/lib/iza/rules-engine';
import type { TipoManifestacaoId, OrgaoId } from '@/lib/iza/types';

interface RequestBody {
  relato: string;
}

interface ClassificacaoResponse {
  tipo: { id: TipoManifestacaoId; confianca: number };
  orgao: { id: OrgaoId; confianca: number };
  entidades: {
    locais: string[];
    datas: string[];
    orgaosMencionados: string[];
  };
  resumo: string;
  meta: {
    fonte: 'backend_gdf';
    tempoProcessamento: number;
    sigiloso: true;
    versaoModelo: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const inicio = performance.now();

  try {
    const body: RequestBody = await request.json();

    if (!body.relato || typeof body.relato !== 'string') {
      return NextResponse.json(
        { error: 'Campo "relato" é obrigatório e deve ser uma string' },
        { status: 400 }
      );
    }

    if (body.relato.length < 10) {
      return NextResponse.json(
        { error: 'Relato deve ter pelo menos 10 caracteres' },
        { status: 400 }
      );
    }

    // Simular latência de rede/processamento (100-500ms)
    const latenciaSimulada = 100 + Math.random() * 400;
    await new Promise(resolve => setTimeout(resolve, latenciaSimulada));

    // Usar a Camada 1 como base e adicionar "boost" de confiança
    // Em produção, seria um modelo de ML real no servidor
    const resultadoBase = classificarPorRegras(body.relato);

    // Simular melhoria de confiança do modelo de IA do GDF
    // (em produção, seria resultado real do modelo)
    const boostConfianca = 0.1 + Math.random() * 0.1; // +10-20%

    const tempoProcessamento = Math.round(performance.now() - inicio);

    const response: ClassificacaoResponse = {
      tipo: {
        id: resultadoBase.tipo.id,
        confianca: Math.min(0.95, resultadoBase.tipo.confianca + boostConfianca),
      },
      orgao: {
        id: resultadoBase.orgao.id,
        confianca: Math.min(0.95, resultadoBase.orgao.confianca + boostConfianca),
      },
      entidades: resultadoBase.entidades,
      resumo: resultadoBase.resumo,
      meta: {
        fonte: 'backend_gdf',
        tempoProcessamento,
        sigiloso: true,
        versaoModelo: 'mock-v1.0.0',
      },
    };

    console.log('[API GDF Mock] Classificação concluída em', tempoProcessamento, 'ms');

    return NextResponse.json(response);

  } catch (error) {
    console.error('[API GDF Mock] Erro:', error);

    return NextResponse.json(
      { error: 'Erro interno ao processar classificação' },
      { status: 500 }
    );
  }
}

/**
 * GET - Informações sobre a API
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    nome: 'API de Classificação Inteligente - Mock GDF',
    versao: 'mock-v1.0.0',
    descricao: 'Simula o comportamento da API real do GDF para classificação de manifestações',
    endpoints: {
      POST: {
        descricao: 'Classifica uma manifestação',
        body: {
          relato: 'string (obrigatório, mínimo 10 caracteres)',
        },
        response: {
          tipo: '{ id: string, confianca: number }',
          orgao: '{ id: string, confianca: number }',
          entidades: '{ locais: string[], datas: string[], orgaosMencionados: string[] }',
          resumo: 'string',
          meta: '{ fonte: "backend_gdf", tempoProcessamento: number, sigiloso: true }',
        },
      },
    },
    privacidade: {
      sigiloso: true,
      armazenamento: 'Nenhum dado é armazenado permanentemente',
      conformidade: ['LAI', 'LGPD'],
    },
  });
}
