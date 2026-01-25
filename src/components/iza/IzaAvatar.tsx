"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { IZA_AVATARES, type IzaVariante } from "@/lib/iza-messages";

interface IzaAvatarProps {
  variante?: IzaVariante;
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

export function IzaAvatar({
  variante = "default",
  size = "md",
  className,
  animate = true,
}: IzaAvatarProps) {
  const imageSrc = IZA_AVATARES[variante] || IZA_AVATARES.default;

  return (
    <div
      className={cn(
        "relative flex-shrink-0",
        sizeClasses[size],
        animate && "animate-fade-in",
        className
      )}
      aria-hidden="true"
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        sizes="(max-width: 768px) 64px, 96px"
        className="object-contain"
        priority
      />
    </div>
  );
}
