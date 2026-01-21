"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManifestacaoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para primeira etapa
    router.replace("/manifestacao/tipo");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted">Carregando...</p>
    </div>
  );
}
