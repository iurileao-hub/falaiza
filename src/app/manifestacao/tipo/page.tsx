"use client";

import { useRouter } from "next/navigation";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { StepCard } from "@/components/wizard/StepCard";
import { NavigationButtons } from "@/components/wizard/NavigationButtons";
import { IzaContainer } from "@/components/iza/IzaContainer";
import { useManifestacaoStore } from "@/stores/manifestacaoStore";
import { TIPOS_MANIFESTACAO } from "@/lib/constants";
import { MENSAGENS_IZA } from "@/lib/iza-messages";
import { TipoManifestacao } from "@/types/manifestacao";

export default function TipoPage() {
  const router = useRouter();
  const { manifestacao, setTipo, podeAvancar, etapaAtual, irParaEtapa } =
    useManifestacaoStore();

  const tipoSelecionado = manifestacao.tipo;

  const handleSelectTipo = (tipo: TipoManifestacao) => {
    setTipo(tipo);
  };

  const handleAvancar = () => {
    if (podeAvancar()) {
      irParaEtapa(2);
      router.push("/manifestacao/assunto");
    }
  };

  return (
    <WizardLayout etapaAtual={etapaAtual}>
      {/* Mensagem da IZA */}
      <IzaContainer
        mensagem={
          tipoSelecionado
            ? MENSAGENS_IZA.tipo.selecao(tipoSelecionado)
            : MENSAGENS_IZA.tipo.inicial
        }
        variante="default"
      />

      {/* Seleção de Tipo */}
      <div
        className="grid gap-4 md:grid-cols-2"
        role="listbox"
        aria-label="Selecione o tipo de manifestação"
      >
        {TIPOS_MANIFESTACAO.map((tipo) => (
          <StepCard
            key={tipo.id}
            id={`tipo-${tipo.id}`}
            icone={tipo.icone}
            titulo={tipo.nome}
            descricao={tipo.descricao}
            selecionado={tipoSelecionado === tipo.id}
            onClick={() => handleSelectTipo(tipo.id)}
          />
        ))}
      </div>

      {/* Dica sobre anonimato */}
      {tipoSelecionado && (
        <div className="mt-6 p-4 bg-info/10 rounded-lg text-sm">
          {TIPOS_MANIFESTACAO.find((t) => t.id === tipoSelecionado)
            ?.permiteAnonimo ? (
            <p className="text-info">
              <strong>Dica:</strong> Este tipo de manifestação permite registro
              anônimo. Você poderá escolher se identificar ou não na etapa de
              identificação.
            </p>
          ) : (
            <p className="text-foreground">
              <strong>Nota:</strong> Este tipo de manifestação requer
              identificação para que possamos respondê-la.
            </p>
          )}
        </div>
      )}

      {/* Navegação */}
      <NavigationButtons
        etapaAtual={1}
        totalEtapas={6}
        podeAvancar={podeAvancar()}
        podeVoltar={false}
        onVoltar={() => {}}
        onAvancar={handleAvancar}
        className="mt-8"
      />
    </WizardLayout>
  );
}
