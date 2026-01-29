"use client";

import Image from "next/image";
import { StepIndicator } from "./StepIndicator";
import { cn } from "@/lib/utils";

interface WizardLayoutProps {
  etapaAtual: number;
  children: React.ReactNode;
  className?: string;
}

export function WizardLayout({
  etapaAtual,
  children,
  className,
}: WizardLayoutProps) {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      {/* Header com logo da Ouvidoria */}
      <div className="bg-gradient-to-b from-surface to-background py-8">
        <div className="container">
          <div className="flex flex-col items-center gap-6">
            {/* Logo Ouvidoria */}
            <Image
              src="/assets/logos/Logo-OUV.svg"
              alt="Ouvidoria do Governo do Distrito Federal"
              width={280}
              height={168}
              style={{ width: 'auto', height: 'auto' }}
              priority
            />

            {/* Indicador de Etapas */}
            <StepIndicator etapaAtual={etapaAtual} />
          </div>
        </div>
      </div>

      {/* Conteúdo da Etapa */}
      <main
        id="main-content"
        className="flex-1 py-8"
        aria-label="Formulário de manifestação"
      >
        <div className="container max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
