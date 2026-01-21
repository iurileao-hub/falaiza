"use client";

import { Progress } from "@/components/ui/progress";
import { ETAPAS_WIZARD } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  etapaAtual: number;
  className?: string;
}

export function ProgressBar({ etapaAtual, className }: ProgressBarProps) {
  const totalEtapas = ETAPAS_WIZARD.length;
  const progresso = ((etapaAtual - 1) / (totalEtapas - 1)) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-muted">
          Etapa {etapaAtual} de {totalEtapas}
        </span>
        <span className="text-muted font-medium">
          {Math.round(progresso)}% concluído
        </span>
      </div>
      <Progress
        value={progresso}
        className="h-2"
        aria-label={`Progresso: etapa ${etapaAtual} de ${totalEtapas}`}
      />
    </div>
  );
}
