/**
 * Página de Sugestão Inteligente (Etapa 2)
 *
 * Exibe a classificação sugerida pela IZA e permite
 * que o usuário confirme ou edite tipo e órgão.
 */

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { NavigationButtons } from "@/components/wizard/NavigationButtons";
import { IzaSugestaoInteligente } from "@/components/iza/IzaSugestaoInteligente";
import { useManifestacaoStore } from "@/stores/manifestacaoStore";
import { TOTAL_ETAPAS } from "@/lib/constants";

export default function SugestaoPage() {
  const router = useRouter();
  const {
    manifestacao,
    classificacao,
    etapaAtual,
    podeAvancar,
    irParaEtapa,
    resetar,
  } = useManifestacaoStore();

  // Redirecionar se não tiver relato
  useEffect(() => {
    if (!manifestacao.relato || manifestacao.relato.length < 20) {
      router.push("/manifestacao/relato");
    }
  }, [manifestacao.relato, router]);

  const handleAvancar = () => {
    if (podeAvancar()) {
      irParaEtapa(3);
      router.push("/manifestacao/anexos");
    }
  };

  const handleVoltar = () => {
    irParaEtapa(1);
    router.push("/manifestacao/relato");
  };

  const handleRecomecar = () => {
    const confirmado = window.confirm(
      "Tem certeza que deseja recomeçar? Seu relato atual será apagado."
    );
    if (confirmado) {
      resetar();
      router.push("/manifestacao/relato");
    }
  };

  return (
    <WizardLayout etapaAtual={etapaAtual}>
      {/* Componente principal de sugestão */}
      <IzaSugestaoInteligente />

      {/* Navegação */}
      <NavigationButtons
        etapaAtual={2}
        totalEtapas={TOTAL_ETAPAS}
        podeAvancar={podeAvancar()}
        podeVoltar={true}
        onVoltar={handleVoltar}
        onAvancar={handleAvancar}
        onRecomecar={handleRecomecar}
        textoAvancar={classificacao?.meta.editadoPeloUsuario ? "Continuar" : "Confirmar"}
        className="mt-8"
      />
    </WizardLayout>
  );
}
