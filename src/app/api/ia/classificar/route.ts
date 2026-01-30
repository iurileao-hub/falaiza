/**
 * API de Classificação Inteligente - FalaIZA
 *
 * Esta é uma implementação mock que simula o comportamento esperado
 * de uma API real do GDF para classificação inteligente.
 *
 * Em produção, esta rota seria substituída por uma integração real
 * com os sistemas de IA do Governo do Distrito Federal, incluindo:
 * - Modelo de classificação (BERTimbau ou similar)
 * - Transcrição de áudio/vídeo (Whisper)
 * - Análise de imagens (GPT-4o, Gemini, ou LLaVA)
 *
 * MULTIMODAL: A arquitetura suporta texto + áudio + vídeo + imagem.
 * Ver: docs/plans/2026-01-24-backend-gdf-especificacao.md
 *
 * SIGILO: Os dados recebidos são tratados com sigilo.
 * Nenhum dado é armazenado permanentemente neste mock.
 */

import { NextRequest, NextResponse } from 'next/server';
import { classificarPorRegras } from '@/lib/iza/rules-engine';
import type { TipoManifestacaoId, OrgaoId } from '@/lib/iza/types';
import { rateLimit } from '@/lib/rate-limit';

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

/**
 * Rate limiter: 60 requisições por minuto por IP
 */
const limiter = rateLimit({
  interval: 60000, // 1 minuto
  maxRequests: 60,
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const inicio = performance.now();

  try {
    // Rate limiting: verificar se IP excedeu o limite
    const rateLimitResult = limiter.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente em breve.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
          },
        }
      );
    }

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

    // Validação de tamanho máximo para evitar abuso
    const MAX_RELATO_LENGTH = 10000;
    const relatoLimpo = body.relato.trim();

    if (relatoLimpo.length > MAX_RELATO_LENGTH) {
      return NextResponse.json(
        { error: `Relato excede o tamanho máximo de ${MAX_RELATO_LENGTH} caracteres` },
        { status: 400 }
      );
    }

    // Simular latência de rede/processamento (100-500ms)
    const latenciaSimulada = 100 + Math.random() * 400;
    await new Promise(resolve => setTimeout(resolve, latenciaSimulada));

    // Usar a Camada 1 como base e adicionar "boost" de confiança
    // Em produção, seria um modelo de ML real no servidor
    const resultadoBase = classificarPorRegras(relatoLimpo);

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

    return NextResponse.json(response);

  } catch (error) {
    // Log apenas em desenvolvimento para não poluir logs de produção
    if (process.env.NODE_ENV === 'development') {
      console.error('[API GDF Mock] Erro:', error);
    }

    return NextResponse.json(
      { error: 'Erro interno ao processar classificação' },
      { status: 500 }
    );
  }
}

/**
 * GET - Informações básicas sobre a API
 * Retorna apenas nome e status, sem expor detalhes internos
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    nome: 'API de Classificação Inteligente - Ouvidoria DF',
    versao: 'mock-v1.0.0',
    status: 'operacional',
    descricao: 'Endpoint para classificação de manifestações cidadãs',
  });
}
