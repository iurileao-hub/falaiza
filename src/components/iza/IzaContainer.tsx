"use client";

import { IzaAvatar } from "./IzaAvatar";
import { IzaMessage } from "./IzaMessage";
import { cn } from "@/lib/utils";
import { type IzaVariante } from "@/lib/iza-messages";

interface IzaContainerProps {
  mensagem: React.ReactNode;
  variante?: IzaVariante;
  className?: string;
  avatarSize?: "sm" | "md" | "lg";
}

export function IzaContainer({
  mensagem,
  variante = "default",
  className,
  avatarSize = "md",
}: IzaContainerProps) {
  return (
    <div
      className={cn(
        "flex items-end gap-4 mb-8",
        className
      )}
    >
      {/* Avatar da IZA */}
      <IzaAvatar variante={variante} size={avatarSize} />

      {/* Balão de mensagem */}
      <div className="flex-1 max-w-2xl">
        <IzaMessage>
          <div className="space-y-2">
            {/* Nome da IZA */}
            <p className="text-sm text-info font-semibold">
              Olá! Sou a <span className="text-lg">IZA</span>
            </p>
            {/* Mensagem */}
            <div className="text-base">{mensagem}</div>
          </div>
        </IzaMessage>
      </div>
    </div>
  );
}
