"use client";

import { cn } from "@/lib/utils";

interface IzaMessageProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function IzaMessage({
  children,
  className,
  animate = true,
}: IzaMessageProps) {
  return (
    <div
      className={cn(
        "relative bg-surface rounded-2xl rounded-bl-none p-6 shadow-sm",
        "border border-border",
        animate && "animate-fade-in",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Triângulo do balão */}
      <div
        className="absolute -left-3 bottom-4 w-0 h-0 border-t-[12px] border-t-transparent border-r-[16px] border-r-surface border-b-[12px] border-b-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute -left-[14px] bottom-4 w-0 h-0 border-t-[12px] border-t-transparent border-r-[16px] border-r-border border-b-[12px] border-b-transparent"
        aria-hidden="true"
        style={{ zIndex: -1 }}
      />

      {/* Conteúdo */}
      <div className="text-foreground leading-relaxed">{children}</div>
    </div>
  );
}
