/**
 * IZA Sugestão Inteligente
 * Componente principal que mostra a classificação sugerida pela IA
 * e permite ao usuário confirmar ou editar
 */

'use client';

import React, { useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { IzaMessage } from './IzaMessage';
import { IzaAvatar } from './IzaAvatar';
import { SeletorComConfianca } from './SeletorComConfianca';
import { getNivelConfianca } from './ConfiancaIndicator';
import { useClassificacao } from '@/hooks/useClassificacao';
import { useManifestacaoStore } from '@/stores/manifestacaoStore';
import {
  getTipoMeta,
  getOrgaoMeta,
  ORGAOS,
  artigoTipo,
  type ClassificacaoResultado,
} from '@/lib/iza';
import { TIPOS_MANIFESTACAO as TIPOS_CONFIG } from '@/lib/constants';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

interface IzaSugestaoInteligenteProps {
  /** Classes adicionais */
  className?: string;
}

/**
 * Monta a mensagem da IZA baseada na classificação
 */
function montarMensagemIza(
  resultado: ClassificacaoResultado | null,
  status: 'idle' | 'classificando' | 'sucesso' | 'erro'
): React.ReactNode {
  if (status === 'classificando') {
    return 'Deixa eu analisar o que você me contou...';
  }

  if (status === 'erro') {
    return 'Ops, tive um probleminha ao analisar seu relato. Mas não se preocupe, você pode escolher manualmente!';
  }

  if (!resultado) {
    return 'Me conta o que aconteceu para eu poder te ajudar a classificar sua manifestação.';
  }

  const nivel = getNivelConfianca(resultado.tipo.confianca);
  const tipoMeta = getTipoMeta(resultado.tipo.id);
  const orgaoMeta = getOrgaoMeta(resultado.orgao.id);

  const artigo = artigoTipo(resultado.tipo.id);
  const tipoNome = tipoMeta?.nome.toLowerCase() || 'manifestação';
  const orgaoNome = orgaoMeta?.nome || 'órgão';

  if (nivel === 'alta') {
    return <>Entendi! Pelo que você me contou, isso parece ser {artigo} {tipoNome} sobre {orgaoNome}. <strong>Está certo?</strong></>;
  }

  if (nivel === 'media') {
    return <>Analisando seu relato, acredito que seja {artigo} {tipoNome} relacionad{artigo === 'uma' ? 'a' : 'o'} a {orgaoNome}. <strong>Confira se está correto!</strong></>;
  }

  return <>Não tenho certeza, mas pode ser {artigo} {tipoNome} sobre {orgaoNome}. <strong>Por favor, verifique e ajuste se necessário.</strong></>;
}

export function IzaSugestaoInteligente({ className }: IzaSugestaoInteligenteProps) {
  const {
    status,
    resultado,
    progresso,
    classificar,
    atualizar,
    resetar,
  } = useClassificacao();

  const {
    manifestacao,
    classificacao: classificacaoStore,
    setClassificacao,
    atualizarClassificacao,
  } = useManifestacaoStore();

  // Classificar automaticamente quando tiver relato
  useEffect(() => {
    const relato = manifestacao.relato;
    if (relato && relato.length >= 20 && status === 'idle' && !classificacaoStore) {
      classificar(relato).then((result) => {
        setClassificacao(result);
      });
    }
  }, [manifestacao.relato, status, classificacaoStore, classificar, setClassificacao]);

  // Usar resultado do store se disponível, senão do hook
  const resultadoAtual = classificacaoStore || resultado;
  const editado = resultadoAtual?.meta.editadoPeloUsuario || false;

  // Opções de tipo formatadas para o seletor
  const opcoesTipo = useMemo(() => {
    return TIPOS_CONFIG.map((tipo) => ({
      id: tipo.id,
      nome: tipo.nome,
      icone: tipo.icone,
      descricao: tipo.descricao,
    }));
  }, []);

  // Opções de órgão formatadas para o seletor
  const opcoesOrgao = useMemo(() => {
    return ORGAOS.map((orgao) => ({
      id: orgao.id,
      nome: orgao.nome,
      icone: orgao.icone,
    }));
  }, []);

  // Valor atual do tipo
  const tipoAtual = useMemo(() => {
    if (!resultadoAtual) return null;
    const meta = getTipoMeta(resultadoAtual.tipo.id);
    const config = TIPOS_CONFIG.find((t) => t.id === resultadoAtual.tipo.id);
    return meta && config
      ? { id: resultadoAtual.tipo.id, nome: meta.nome, icone: config.icone }
      : null;
  }, [resultadoAtual]);

  // Valor atual do órgão
  const orgaoAtual = useMemo(() => {
    if (!resultadoAtual) return null;
    const meta = getOrgaoMeta(resultadoAtual.orgao.id);
    return meta ? { id: resultadoAtual.orgao.id, nome: meta.nome, icone: meta.icone } : null;
  }, [resultadoAtual]);

  // Handlers para mudança de valores
  const handleTipoChange = useCallback(
    (opcao: { id: string; nome: string }) => {
      if (!resultadoAtual) return;

      const novoTipo = {
        id: opcao.id as typeof resultadoAtual.tipo.id,
        confianca: 1, // Usuário escolheu, confiança 100%
      };

      atualizarClassificacao({ tipo: novoTipo });
    },
    [resultadoAtual, atualizarClassificacao]
  );

  const handleOrgaoChange = useCallback(
    (opcao: { id: string; nome: string }) => {
      if (!resultadoAtual) return;

      const novoOrgao = {
        id: opcao.id as typeof resultadoAtual.orgao.id,
        confianca: 1,
      };

      atualizarClassificacao({ orgao: novoOrgao });
    },
    [resultadoAtual, atualizarClassificacao]
  );

  const mensagemIza = montarMensagemIza(resultadoAtual, status);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Mensagem da IZA com avatar */}
      <div className="flex items-end gap-3">
        <IzaAvatar variante="default" size="md" />
        <div className="flex-1 min-w-0">
          <IzaMessage animate={status !== 'classificando'}>
            {mensagemIza}
          </IzaMessage>
        </div>
      </div>

      {/* Loading state */}
      {status === 'classificando' && (
        <div
          className="flex items-center justify-center gap-3 py-8"
          role="status"
          aria-label="Analisando relato"
        >
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-gray-600">
            Analisando...
          </span>
        </div>
      )}

      {/* Erro state */}
      {status === 'erro' && (
        <div
          className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            A classificação automática não funcionou, mas você pode escolher manualmente abaixo.
          </p>
        </div>
      )}

      {/* Resultado da classificação */}
      {resultadoAtual && (status === 'sucesso' || status === 'idle') && (
        <div className="space-y-4">
          {/* Seletores */}
          <SeletorComConfianca
            label="Tipo de Manifestação"
            valor={tipoAtual}
            confianca={resultadoAtual.tipo.confianca}
            opcoes={opcoesTipo}
            onChange={handleTipoChange}
            editado={editado}
            id="tipo-manifestacao"
          />

          <SeletorComConfianca
            label="Área / Órgão"
            valor={orgaoAtual}
            confianca={resultadoAtual.orgao.confianca}
            opcoes={opcoesOrgao}
            onChange={handleOrgaoChange}
            editado={editado}
            id="orgao-manifestacao"
          />

          {/* Resumo gerado */}
          {resultadoAtual.resumo && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Resumo da manifestação
              </h4>
              <p className="text-sm text-gray-600">{resultadoAtual.resumo}</p>
            </div>
          )}

          {/* Entidades extraídas */}
          {(resultadoAtual.entidades.locais.length > 0 ||
            resultadoAtual.entidades.datas.length > 0 ||
            resultadoAtual.entidades.orgaosMencionados.length > 0) && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-700 mb-2">
                Identificamos no seu relato
              </h4>
              <div className="flex flex-wrap gap-2">
                {resultadoAtual.entidades.locais.map((local, i) => (
                  <span
                    key={`local-${i}`}
                    className="px-2 py-1 text-xs bg-white rounded-full text-blue-700 border border-blue-200"
                  >
                    📍 {local}
                  </span>
                ))}
                {resultadoAtual.entidades.datas.map((data, i) => (
                  <span
                    key={`data-${i}`}
                    className="px-2 py-1 text-xs bg-white rounded-full text-blue-700 border border-blue-200"
                  >
                    📅 {data}
                  </span>
                ))}
                {resultadoAtual.entidades.orgaosMencionados.map((orgao, i) => (
                  <span
                    key={`orgao-${i}`}
                    className="px-2 py-1 text-xs bg-white rounded-full text-blue-700 border border-blue-200"
                  >
                    🏛️ {orgao}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Confirmação visual */}
          {editado && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Classificação ajustada por você
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IzaSugestaoInteligente;
