/**
 * Indicador de Privacidade - mostra qual camada de IA está sendo usada
 * Diferencial de transparência para o cidadão
 */

'use client';

import { cn } from '@/lib/utils';
import type { CamadaClassificacao } from '@/lib/iza';

interface PrivacidadeIndicatorProps {
  /** Camada de classificação ativa */
  camada: CamadaClassificacao;
  /** Tempo de processamento em ms */
  tempoMs?: number;
  /** Mostrar descrição completa */
  expandido?: boolean;
  /** Classes adicionais */
  className?: string;
}

/**
 * Configuração de cada camada (2 camadas após ADR-001)
 */
const CAMADAS_CONFIG: Record<
  CamadaClassificacao,
  {
    nome: string;
    icone: string;
    descricao: string;
    cor: string;
    bgCor: string;
    privacidade: string;
  }
> = {
  regras: {
    nome: 'Processamento Local',
    icone: '🔒',
    descricao: 'Classificação por regras, 100% no seu dispositivo',
    cor: 'text-green-700',
    bgCor: 'bg-green-50 border-green-200',
    privacidade: 'Seus dados não saem do dispositivo',
  },
  backend_gdf: {
    nome: 'Servidor GDF',
    icone: '☁️',
    descricao: 'Processamento em servidor seguro do GDF com IA multimodal',
    cor: 'text-purple-700',
    bgCor: 'bg-purple-50 border-purple-200',
    privacidade: 'Dados enviados apenas para servidores do GDF (HTTPS + LGPD)',
  },
};

export function PrivacidadeIndicator({
  camada,
  tempoMs,
  expandido = false,
  className,
}: PrivacidadeIndicatorProps) {
  const config = CAMADAS_CONFIG[camada];

  return (
    <div
      className={cn(
        'rounded-lg border p-3',
        config.bgCor,
        className
      )}
      role="status"
      aria-label={`Privacidade: ${config.nome}`}
    >
      <div className="flex items-start gap-2">
        {/* Ícone */}
        <span className="text-lg" aria-hidden="true">
          {config.icone}
        </span>

        <div className="flex-1 min-w-0">
          {/* Nome da camada */}
          <div className="flex items-center gap-2">
            <span className={cn('font-medium text-sm', config.cor)}>
              {config.nome}
            </span>
            {tempoMs !== undefined && (
              <span className="text-xs text-gray-500">
                ({tempoMs}ms)
              </span>
            )}
          </div>

          {/* Descrição expandida */}
          {expandido && (
            <div className="mt-1 space-y-1">
              <p className="text-xs text-gray-600">
                {config.descricao}
              </p>
              <p className={cn('text-xs font-medium', config.cor)}>
                {config.privacidade}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Badge compacto de privacidade
 */
export function PrivacidadeBadge({
  camada,
  className,
}: {
  camada: CamadaClassificacao;
  className?: string;
}) {
  const config = CAMADAS_CONFIG[camada];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
        config.bgCor,
        config.cor,
        className
      )}
      title={config.privacidade}
    >
      <span aria-hidden="true">{config.icone}</span>
      {camada === 'regras' ? 'Local' : 'GDF'}
    </span>
  );
}

export default PrivacidadeIndicator;
