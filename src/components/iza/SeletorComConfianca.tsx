/**
 * Seletor com Indicador de Confiança
 * Permite ao usuário confirmar ou alterar a sugestão da IZA
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ConfiancaBadge, getNivelConfianca } from './ConfiancaIndicator';
import { ChevronDown, Check, Edit2 } from 'lucide-react';

interface Opcao {
  id: string;
  nome: string;
  icone?: string;
  descricao?: string;
}

interface SeletorComConfiancaProps<T extends Opcao> {
  /** Label do campo */
  label: string;
  /** Valor selecionado atualmente */
  valor: T | null;
  /** Confiança da sugestão (0 a 1) */
  confianca: number;
  /** Lista de opções disponíveis */
  opcoes: T[];
  /** Callback quando valor muda */
  onChange: (opcao: T) => void;
  /** Se foi editado manualmente */
  editado?: boolean;
  /** Classes adicionais */
  className?: string;
  /** ID para acessibilidade */
  id?: string;
}

export function SeletorComConfianca<T extends Opcao>({
  label,
  valor,
  confianca,
  opcoes,
  onChange,
  editado = false,
  className,
  id,
}: SeletorComConfiancaProps<T>) {
  const [aberto, setAberto] = useState(false);
  const nivel = getNivelConfianca(confianca);
  const seletorId = id || `seletor-${label.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div className={cn('relative', className)}>
      {/* Label */}
      <label
        htmlFor={seletorId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      {/* Botão do seletor */}
      <button
        id={seletorId}
        type="button"
        onClick={() => setAberto(!aberto)}
        className={cn(
          'w-full flex items-center justify-between gap-2',
          'px-4 py-3 rounded-lg border-2 transition-all',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          aberto
            ? 'border-primary bg-white shadow-md'
            : 'border-gray-200 bg-white hover:border-gray-300',
          nivel === 'baixa' && !editado && 'border-yellow-300 bg-yellow-50'
        )}
        aria-expanded={aberto}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Ícone */}
          {valor?.icone && (
            <span className="text-xl flex-shrink-0" aria-hidden="true">
              {valor.icone}
            </span>
          )}

          {/* Nome e indicadores */}
          <div className="flex flex-col items-start min-w-0">
            <span className="font-medium text-gray-900 truncate">
              {valor?.nome || 'Selecione...'}
            </span>
            {valor && !editado && (
              <span className="text-xs text-gray-500">
                Sugerido pela IZA
              </span>
            )}
            {editado && (
              <span className="text-xs text-blue-600 flex items-center gap-1">
                <Edit2 className="w-3 h-3" />
                Editado por você
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Badge de confiança */}
          {!editado && <ConfiancaBadge confianca={confianca} />}

          {/* Ícone expandir */}
          <ChevronDown
            className={cn(
              'w-5 h-5 text-gray-400 transition-transform',
              aberto && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* Dropdown */}
      {aberto && (
        <>
          {/* Overlay para fechar */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setAberto(false)}
            aria-hidden="true"
          />

          {/* Lista de opções */}
          <ul
            role="listbox"
            aria-labelledby={seletorId}
            className={cn(
              'absolute z-20 w-full mt-1',
              'bg-white border border-gray-200 rounded-lg shadow-lg',
              'max-h-60 overflow-auto',
              'focus:outline-none'
            )}
          >
            {opcoes.map((opcao) => {
              const selecionado = valor?.id === opcao.id;

              return (
                <li
                  key={opcao.id}
                  role="option"
                  aria-selected={selecionado}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 cursor-pointer',
                    'hover:bg-gray-50 transition-colors',
                    selecionado && 'bg-primary/5'
                  )}
                  onClick={() => {
                    onChange(opcao);
                    setAberto(false);
                  }}
                >
                  {/* Ícone da opção */}
                  {opcao.icone && (
                    <span className="text-xl flex-shrink-0" aria-hidden="true">
                      {opcao.icone}
                    </span>
                  )}

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-900">
                      {opcao.nome}
                    </span>
                    {opcao.descricao && (
                      <p className="text-sm text-gray-500 truncate">
                        {opcao.descricao}
                      </p>
                    )}
                  </div>

                  {/* Check se selecionado */}
                  {selecionado && (
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default SeletorComConfianca;
