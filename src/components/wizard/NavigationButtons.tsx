"use client";

import { ChevronLeft, ChevronRight, Send, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationButtonsProps {
  etapaAtual: number;
  totalEtapas: number;
  podeAvancar: boolean;
  podeVoltar: boolean;
  isSubmitting?: boolean;
  onVoltar: () => void;
  onAvancar: () => void;
  onEnviar?: () => void;
  onRecomecar?: () => void;
  textoAvancar?: string;
  textoVoltar?: string;
  className?: string;
}

export function NavigationButtons({
  etapaAtual,
  totalEtapas,
  podeAvancar,
  podeVoltar,
  isSubmitting = false,
  onVoltar,
  onAvancar,
  onEnviar,
  onRecomecar,
  textoAvancar = "Avançar",
  textoVoltar = "Voltar",
  className,
}: NavigationButtonsProps) {
  const isUltimaEtapa = etapaAtual === totalEtapas;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border",
        className
      )}
    >
      {/* Botões do lado esquerdo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Botão Voltar - Estilo Participa DF */}
        <Button
          type="button"
          variant="outline"
          onClick={onVoltar}
          disabled={!podeVoltar || isSubmitting}
          className={cn(
            "bg-[#28477D] text-white border-[#28477D] hover:bg-[#1E3A5F] hover:border-[#1E3A5F] hover:text-white",
            !podeVoltar && "invisible"
          )}
        >
          <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{textoVoltar}</span>
          <span className="sm:hidden">Voltar</span>
        </Button>

        {/* Botão Recomeçar (opcional) - ícone apenas em mobile */}
        {onRecomecar && (
          <Button
            type="button"
            variant="ghost"
            onClick={onRecomecar}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 sm:px-4"
            title="Limpar e recomeçar"
          >
            <RotateCcw className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Recomeçar</span>
          </Button>
        )}
      </div>

      {/* Botão Avançar ou Enviar - Estilo Participa DF (Verde) */}
      {isUltimaEtapa ? (
        <Button
          type="button"
          onClick={onEnviar}
          disabled={!podeAvancar || isSubmitting}
          className="bg-[#549250] hover:bg-[#3d7039] text-white flex-shrink-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span className="hidden sm:inline">Enviando...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Enviar Manifestação</span>
              <span className="sm:hidden">Enviar</span>
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onAvancar}
          disabled={!podeAvancar || isSubmitting}
          className="bg-[#549250] hover:bg-[#3d7039] text-white disabled:bg-gray-300 disabled:text-gray-500 flex-shrink-0"
        >
          <span className="hidden sm:inline">{textoAvancar}</span>
          <span className="sm:hidden">{textoAvancar === "Confirmar" ? "Confirmar" : "Avançar"}</span>
          <ChevronRight className="h-4 w-4 ml-1 sm:ml-2" />
        </Button>
      )}
    </div>
  );
}
