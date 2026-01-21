"use client";

import { cn } from "@/lib/utils";

interface StepCardProps {
  id: string;
  icone: string;
  titulo: string;
  descricao: string;
  selecionado?: boolean;
  onClick: () => void;
  className?: string;
}

export function StepCard({
  id,
  icone,
  titulo,
  descricao,
  selecionado = false,
  onClick,
  className,
}: StepCardProps) {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      className={cn(
        "w-full text-left p-6 rounded-xl border-2 transition-all duration-200",
        "hover:border-primary hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
        selecionado
          ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary"
          : "border-border bg-surface",
        className
      )}
      aria-selected={selecionado}
      role="option"
    >
      <div className="flex items-start gap-4">
        <span
          className="text-4xl"
          role="img"
          aria-hidden="true"
        >
          {icone}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground mb-1">
            {titulo}
          </h3>
          <p className="text-sm text-muted">{descricao}</p>
        </div>
        {selecionado && (
          <div
            className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
