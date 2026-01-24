"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Página de Assunto (Obsoleta)
 *
 * No novo fluxo "story-first", o assunto/área é sugerido automaticamente pela IZA
 * após o usuário contar sua história. Esta página redireciona para a sugestão.
 */
export default function AssuntoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para a etapa de sugestão do novo fluxo
    router.replace("/manifestacao/sugestao");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted">Redirecionando...</p>
    </div>
  );
}
