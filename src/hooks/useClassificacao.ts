/**
 * Hook para gerenciar o processo de classificação de manifestações
 * Integra com o engine da IZA Inteligente
 */

'use client';

import { useState, useCallback } from 'react';
import {
  classificar,
  getConfigIA,
  type ClassificacaoResultado,
  type OpcoesClassificacao,
} from '@/lib/iza';

export type StatusClassificacao = 'idle' | 'classificando' | 'sucesso' | 'erro';

export interface UseClassificacaoReturn {
  /** Status atual do processo de classificação */
  status: StatusClassificacao;

  /** Resultado da classificação (quando status === 'sucesso') */
  resultado: ClassificacaoResultado | null;

  /** Erro ocorrido (quando status === 'erro') */
  erro: Error | null;

  /** Progresso da classificação (0 a 1) */
  progresso: number;

  /** Inicia o processo de classificação */
  classificar: (relato: string, opcoes?: OpcoesClassificacao) => Promise<ClassificacaoResultado>;

  /** Atualiza o resultado com edições do usuário */
  atualizar: (dados: Partial<ClassificacaoResultado>) => void;

  /** Reseta o estado para inicial */
  resetar: () => void;
}

/**
 * Hook para classificação de manifestações usando IZA Inteligente
 *
 * @example
 * ```tsx
 * const { status, resultado, progresso, classificar } = useClassificacao();
 *
 * const handleSubmit = async () => {
 *   const result = await classificar(relato);
 *   console.log(result.tipo.id); // 'reclamacao'
 * };
 * ```
 */
export function useClassificacao(): UseClassificacaoReturn {
  const [status, setStatus] = useState<StatusClassificacao>('idle');
  const [resultado, setResultado] = useState<ClassificacaoResultado | null>(null);
  const [erro, setErro] = useState<Error | null>(null);
  const [progresso, setProgresso] = useState(0);

  /**
   * Executa a classificação do relato
   */
  const executarClassificacao = useCallback(
    async (
      relato: string,
      opcoes: OpcoesClassificacao = {}
    ): Promise<ClassificacaoResultado> => {
      setStatus('classificando');
      setErro(null);
      setProgresso(0);

      try {
        const config = getConfigIA();

        const result = await classificar(relato, {
          usarBackendGDF: opcoes.usarBackendGDF ?? config.usarBackendGDF,
          onProgress: (p) => setProgresso(p),
        });

        setResultado(result);
        setStatus('sucesso');
        setProgresso(1);

        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Erro desconhecido');
        setErro(err);
        setStatus('erro');
        throw err;
      }
    },
    []
  );

  /**
   * Atualiza o resultado com edições do usuário
   */
  const atualizar = useCallback((dados: Partial<ClassificacaoResultado>) => {
    setResultado((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        ...dados,
        meta: {
          ...prev.meta,
          editadoPeloUsuario: true,
        },
      };
    });
  }, []);

  /**
   * Reseta o estado para inicial
   */
  const resetar = useCallback(() => {
    setStatus('idle');
    setResultado(null);
    setErro(null);
    setProgresso(0);
  }, []);

  return {
    status,
    resultado,
    erro,
    progresso,
    classificar: executarClassificacao,
    atualizar,
    resetar,
  };
}

export default useClassificacao;
