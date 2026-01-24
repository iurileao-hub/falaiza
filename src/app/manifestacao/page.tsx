"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManifestacaoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para primeira etapa (Relato - story-first)
    router.replace("/manifestacao/relato");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted">Carregando...</p>
    </div>
  );
}
