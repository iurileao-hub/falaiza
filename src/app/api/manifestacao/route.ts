// API Mock - Manifestação
// Simula integração com backend do Participa DF
// Configurado para fácil migração para API real

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { envioManifestacaoSchema } from "@/lib/validations";
import { gerarProtocolo } from "@/lib/protocolo";
import { PRAZOS_RESPOSTA } from "@/lib/constants";
import { sleep } from "@/lib/utils";
import { TipoManifestacao } from "@/types/manifestacao";

/**
 * Configuração do Mock API
 * Em produção, estas configurações viriam de variáveis de ambiente
 */
const MOCK_CONFIG = {
  // Simular delay de rede (ms)
  networkDelay: 1500,

  // Taxa de sucesso (para testes de resiliência)
  successRate: 0.95,

  // Simular erros específicos
  simulateErrors: process.env.NEXT_PUBLIC_SIMULATE_ERRORS === "true",

  // Log detalhado
  verbose: process.env.NODE_ENV === "development",
};

/**
 * Log helper para desenvolvimento
 */
function log(message: string, data?: unknown) {
  if (MOCK_CONFIG.verbose) {
    console.log(`[API Mock] ${message}`, data || "");
  }
}

/**
 * POST /api/manifestacao
 * Recebe e processa uma nova manifestação
 */
export async function POST(request: NextRequest) {
  try {
    log("Recebendo nova manifestação...");

    // Simular delay de rede
    await sleep(MOCK_CONFIG.networkDelay);

    // Simular falha aleatória (para testes de resiliência)
    if (MOCK_CONFIG.simulateErrors && Math.random() > MOCK_CONFIG.successRate) {
      log("Simulando erro de rede");
      return NextResponse.json(
        {
          success: false,
          erro: "NETWORK_ERROR",
          mensagem: "Erro de conexão com o servidor. Tente novamente.",
        },
        { status: 503 }
      );
    }

    // Parse do body
    const body = await request.json();
    log("Dados recebidos:", body);

    // Validar dados
    const validacao = envioManifestacaoSchema.safeParse(body);

    if (!validacao.success) {
      log("Erro de validação:", validacao.error.issues);
      return NextResponse.json(
        {
          success: false,
          erro: "VALIDATION_ERROR",
          mensagem: "Dados inválidos. Verifique os campos e tente novamente.",
          detalhes: validacao.error.issues.map((issue: z.ZodIssue) => ({
            campo: issue.path.join("."),
            mensagem: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const dados = validacao.data;

    // Gerar protocolo
    const protocolo = gerarProtocolo();
    log("Protocolo gerado:", protocolo);

    // Obter prazo de resposta
    const prazoConfig = PRAZOS_RESPOSTA[dados.tipo as TipoManifestacao];
    const prazo = prazoConfig
      ? `${prazoConfig.padrao} ${prazoConfig.unidade}`
      : "30 dias úteis";

    // Simular armazenamento (em produção, enviaria para backend real)
    const manifestacaoSalva = {
      protocolo,
      tipo: dados.tipo,
      assunto: dados.assunto,
      relato: dados.relato.substring(0, 100) + "...", // Truncar para log
      anonimo: dados.anonimo,
      identificacao: dados.anonimo ? null : "***PROTEGIDO***",
      anexosCount: dados.anexos?.length || 0,
      criadoEm: new Date().toISOString(),
    };
    log("Manifestação processada:", manifestacaoSalva);

    // Resposta de sucesso
    return NextResponse.json({
      success: true,
      protocolo,
      mensagem: "Manifestação registrada com sucesso!",
      prazoResposta: prazo,
      dataRegistro: new Date().toISOString(),
      // Informações adicionais úteis para o frontend
      meta: {
        tipo: dados.tipo,
        categoria: dados.assunto.categoria,
        anonimo: dados.anonimo,
        temAnexos: (dados.anexos?.length || 0) > 0,
      },
    });
  } catch (error) {
    console.error("[API Mock] Erro interno:", error);

    return NextResponse.json(
      {
        success: false,
        erro: "INTERNAL_ERROR",
        mensagem: "Erro interno do servidor. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/manifestacao
 * Retorna informações sobre o endpoint (para documentação)
 */
export async function GET() {
  return NextResponse.json({
    name: "API Manifestação - Ouvidoria DF",
    version: "1.0.0",
    description: "API mock para registro de manifestações cidadãs",
    endpoints: {
      "POST /api/manifestacao": {
        description: "Registra uma nova manifestação",
        body: {
          tipo: "string (reclamacao|denuncia|sugestao|elogio|solicitacao|informacao)",
          assunto: {
            categoria: "string",
            subcategoria: "string (opcional)",
            descricao: "string (opcional)",
          },
          relato: "string (mín. 20 caracteres)",
          anonimo: "boolean",
          identificacao: "object | null",
          anexos: "array (opcional)",
        },
        response: {
          success: "boolean",
          protocolo: "string (formato: AAAA.MMDD.XXXXXXXX)",
          mensagem: "string",
          prazoResposta: "string",
        },
      },
    },
    status: "mock",
    note: "Este é um endpoint mock para desenvolvimento. Em produção, conectar ao backend real do Participa DF.",
  });
}
