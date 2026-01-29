/**
 * Indicador de Confiança da Classificação IA
 * Mostra visualmente o nível de certeza da IZA
 */

'use client';

import { cn } from '@/lib/utils';

export type NivelConfianca = 'alta' | 'media' | 'baixa';

interface ConfiancaIndicatorProps {
  /** Valor da confiança (0 a 1) */
  confianca: number;
  /** Mostrar texto descritivo */
  mostrarTexto?: boolean;
  /** Tamanho do indicador */
  tamanho?: 'sm' | 'md' | 'lg';
  /** Classes adicionais */
  className?: string;
}

/**
 * Converte valor numérico para nível de confiança
 */
export function getNivelConfianca(confianca: number): NivelConfianca {
  if (confianca >= 0.8) return 'alta';
  if (confianca >= 0.5) return 'media';
  return 'baixa';
}

/**
 * Textos descritivos por nível
 */
const TEXTOS_NIVEL: Record<NivelConfianca, string> = {
  alta: 'Alta confiança',
  media: 'Confiança moderada',
  baixa: 'Baixa confiança',
};

/**
 * Cores por nível
 */
const CORES_NIVEL: Record<NivelConfianca, { bg: string; text: string; bar: string }> = {
  alta: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    bar: 'bg-green-500',
  },
  media: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    bar: 'bg-yellow-500',
  },
  baixa: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    bar: 'bg-red-500',
  },
};

/**
 * Tamanhos do indicador
 */
const TAMANHOS = {
  sm: { height: 'h-1', width: 'w-16', text: 'text-xs' },
  md: { height: 'h-2', width: 'w-24', text: 'text-sm' },
  lg: { height: 'h-3', width: 'w-32', text: 'text-base' },
};

export function ConfiancaIndicator({
  confianca,
  mostrarTexto = true,
  tamanho = 'md',
  className,
}: ConfiancaIndicatorProps) {
  const nivel = getNivelConfianca(confianca);
  const cores = CORES_NIVEL[nivel];
  const tam = TAMANHOS[tamanho];
  const porcentagem = Math.round(confianca * 100);

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="meter"
      aria-valuenow={porcentagem}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Confiança da classificação: ${TEXTOS_NIVEL[nivel].toLowerCase()}`}
    >
      {/* Barra de progresso */}
      <div
        className={cn(
          'rounded-full overflow-hidden bg-gray-200',
          tam.height,
          tam.width
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            cores.bar
          )}
          style={{ width: `${porcentagem}%` }}
        />
      </div>

      {/* Texto */}
      {mostrarTexto && (
        <span className={cn('font-medium', tam.text, cores.text)}>
          {TEXTOS_NIVEL[nivel]}
        </span>
      )}
    </div>
  );
}

/**
 * Badge compacto de confiança
 */
export function ConfiancaBadge({
  confianca,
  className,
}: {
  confianca: number;
  className?: string;
}) {
  const nivel = getNivelConfianca(confianca);
  const cores = CORES_NIVEL[nivel];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        cores.bg,
        cores.text,
        className
      )}
      role="status"
      aria-label={TEXTOS_NIVEL[nivel]}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', cores.bar)} />
      {TEXTOS_NIVEL[nivel]}
    </span>
  );
}

export default ConfiancaIndicator;
