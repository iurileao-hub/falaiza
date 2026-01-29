// API Manifestação - FalaIZA
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
  successRate: 1.0, // 100% de sucesso em modo demo

  // Simular erros específicos
  simulateErrors: false, // Desabilitado em modo demo

  // Log detalhado
  verbose: process.env.NODE_ENV === "development",

  // Modo demo: validação simplificada
  demoMode: true,
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
// TODO: Adicionar rate limiting para produção (ex: 30 req/min por IP)
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

    // Validação Zod sempre ativa, independente do modo (demo ou produção)
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
    const relatoTruncado = dados.relato
      ? dados.relato.substring(0, 100) + (dados.relato.length > 100 ? "..." : "")
      : "(sem texto - apenas mídia)";

    const manifestacaoSalva = {
      protocolo,
      tipo: dados.tipo,
      assunto: dados.assunto,
      relato: relatoTruncado,
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
 * Retorna informações básicas sobre o endpoint, sem expor detalhes internos
 */
export async function GET() {
  return NextResponse.json({
    nome: "API Manifestação - Ouvidoria DF",
    versao: "1.0.0",
    status: "operacional",
    descricao: "Endpoint para registro de manifestações cidadãs",
  });
}
