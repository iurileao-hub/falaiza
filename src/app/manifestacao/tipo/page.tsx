"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Página de Tipo (Obsoleta)
 *
 * No novo fluxo "story-first", o tipo é sugerido automaticamente pela IZA
 * após o usuário contar sua história. Esta página redireciona para o relato.
 */
export default function TipoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para a primeira etapa do novo fluxo
    router.replace("/manifestacao/relato");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted">Redirecionando...</p>
    </div>
  );
}
