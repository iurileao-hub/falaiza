"use client";

import { ETAPAS_WIZARD } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  etapaAtual: number;
  className?: string;
}

export function StepIndicator({ etapaAtual, className }: StepIndicatorProps) {
  return (
    <nav
      aria-label="Progresso do formulário"
      className={cn("w-full", className)}
    >
      {/* Desktop: Horizontal */}
      <ol className="hidden md:flex items-center justify-center gap-2">
        {ETAPAS_WIZARD.map((etapa, index) => {
          const isCompleted = index + 1 < etapaAtual;
          const isCurrent = index + 1 === etapaAtual;
          const isPending = index + 1 > etapaAtual;

          return (
            <li key={etapa.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isCompleted && "bg-success/10 text-success",
                  isCurrent && "bg-primary text-white",
                  isPending && "bg-surface text-muted"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 mr-2" aria-hidden="true" />
                ) : null}
                <span>{etapa.nome}</span>
              </div>
              {index < ETAPAS_WIZARD.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 mx-1",
                    isCompleted ? "bg-success" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile: Compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {ETAPAS_WIZARD.map((etapa, index) => {
            const isCompleted = index + 1 < etapaAtual;
            const isCurrent = index + 1 === etapaAtual;

            return (
              <div
                key={etapa.id}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-medium",
                  isCompleted && "bg-success/10 text-success",
                  isCurrent && "bg-primary text-white",
                  !isCompleted && !isCurrent && "bg-surface text-muted"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="h-3 w-3 inline mr-1" aria-hidden="true" />
                ) : null}
                {etapa.nome}
              </div>
            );
          })}
        </div>
      </div>

      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite">
        Você está na etapa {etapaAtual} de {ETAPAS_WIZARD.length}:{" "}
        {ETAPAS_WIZARD[etapaAtual - 1]?.nome}
      </div>
    </nav>
  );
}
