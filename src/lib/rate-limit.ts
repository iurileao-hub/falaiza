/**
 * Rate Limiter para Next.js API Routes
 *
 * Implementa limitação de taxa em memória baseada em IP.
 * Para produção em múltiplas instâncias, considere usar Redis.
 */

import { NextRequest } from 'next/server';

interface RateLimitOptions {
  /** Intervalo de tempo em milissegundos */
  interval: number;
  /** Número máximo de requisições no intervalo */
  maxRequests: number;
}

interface RateLimitResult {
  /** Se a requisição está dentro do limite */
  success: boolean;
  /** Número de requisições restantes no intervalo */
  remaining: number;
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

/**
 * Mapa de IPs -> dados de rate limiting
 * Estrutura: Map<ip, { count: number, resetTime: timestamp }>
 */
const requests = new Map<string, RequestRecord>();

/**
 * Intervalo de limpeza automática (5 minutos)
 */
const CLEANUP_INTERVAL = 5 * 60 * 1000;

/**
 * Timer de limpeza (singleton)
 */
let cleanupTimer: NodeJS.Timeout | null = null;

/**
 * Inicia o timer de limpeza automática se não estiver rodando
 */
function startCleanupTimer() {
  if (cleanupTimer) return;

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    const keysToDelete: string[] = [];

    // Identificar entradas expiradas
    requests.forEach((record, ip) => {
      if (now > record.resetTime) {
        keysToDelete.push(ip);
      }
    });

    // Remover entradas expiradas
    for (const ip of keysToDelete) {
      requests.delete(ip);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Rate Limit] Limpeza: ${keysToDelete.length} IPs removidos`);
    }
  }, CLEANUP_INTERVAL);

  // Garantir que o timer não impeça o processo de terminar
  cleanupTimer.unref();
}

/**
 * Extrai o IP da requisição
 * Prioridade: x-forwarded-for > x-real-ip > 'anonymous'
 */
function getIP(request: NextRequest): string {
  // Tentar x-forwarded-for (proxies, load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Pegar primeiro IP da lista (IP original do cliente)
    return forwardedFor.split(',')[0].trim();
  }

  // Tentar x-real-ip (alguns proxies)
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Fallback para desenvolvimento local
  return 'anonymous';
}

/**
 * Cria um rate limiter com as opções especificadas
 *
 * @example
 * ```ts
 * const limiter = rateLimit({ interval: 60000, maxRequests: 30 });
 *
 * export async function POST(request: NextRequest) {
 *   const result = limiter.check(request);
 *   if (!result.success) {
 *     return NextResponse.json(
 *       { error: 'Muitas requisições. Tente novamente em breve.' },
 *       { status: 429 }
 *     );
 *   }
 *   // ... processar requisição
 * }
 * ```
 */
export function rateLimit(options: RateLimitOptions) {
  const { interval, maxRequests } = options;

  // Iniciar timer de limpeza na primeira instanciação
  startCleanupTimer();

  return {
    /**
     * Verifica se a requisição está dentro do limite
     */
    check(request: NextRequest): RateLimitResult {
      const ip = getIP(request);
      const now = Date.now();

      const record = requests.get(ip);

      // Primeira requisição ou janela expirada
      if (!record || now > record.resetTime) {
        requests.set(ip, {
          count: 1,
          resetTime: now + interval,
        });

        return {
          success: true,
          remaining: maxRequests - 1,
        };
      }

      // Janela ainda ativa
      const newCount = record.count + 1;

      if (newCount > maxRequests) {
        // Limite excedido
        return {
          success: false,
          remaining: 0,
        };
      }

      // Incrementar contador
      record.count = newCount;
      requests.set(ip, record);

      return {
        success: true,
        remaining: maxRequests - newCount,
      };
    },
  };
}

/**
 * Para testes: limpa todos os registros
 */
export function clearRateLimitCache() {
  requests.clear();
}
