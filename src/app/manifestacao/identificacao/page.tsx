"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, User } from "lucide-react";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { NavigationButtons } from "@/components/wizard/NavigationButtons";
import { IzaContainer } from "@/components/iza/IzaContainer";
import { IdentificacaoForm } from "@/components/forms/IdentificacaoForm";
import { useManifestacaoStore } from "@/stores/manifestacaoStore";
import { MENSAGENS_IZA } from "@/lib/iza-messages";
import { IdentificacaoCidadao } from "@/types/manifestacao";
import { cn } from "@/lib/utils";

export default function IdentificacaoPage() {
  const router = useRouter();
  const {
    manifestacao,
    setIdentificacao,
    setAnonimo,
    permiteAnonimo,
    podeAvancar,
    etapaAtual,
    irParaEtapa,
    resetar,
  } = useManifestacaoStore();

  const anonimo = manifestacao.anonimo || false;
  const podeSerAnonimo = permiteAnonimo();

  // Determinar mensagem da IZA
  const getMensagemIza = () => {
    if (anonimo) {
      return MENSAGENS_IZA.identificacao.anonimo;
    }
    if (podeSerAnonimo) {
      return MENSAGENS_IZA.identificacao.inicial;
    }
    if (manifestacao.tipo) {
      return MENSAGENS_IZA.identificacao.obrigatorio(manifestacao.tipo);
    }
    return MENSAGENS_IZA.identificacao.identificado;
  };

  const handleIdentificacaoChange = useCallback(
    (data: IdentificacaoCidadao) => {
      setIdentificacao(data);
    },
    [setIdentificacao]
  );

  const handleAnonimoChange = useCallback(
    (value: boolean) => {
      setAnonimo(value);
      if (value) {
        setIdentificacao(null);
      }
    },
    [setAnonimo, setIdentificacao]
  );

  // Novo fluxo: Identificação é etapa 4, próxima é Confirmação (etapa 5)
  const handleAvancar = () => {
    if (podeAvancar()) {
      irParaEtapa(5);
      router.push("/manifestacao/confirmacao");
    }
  };

  const handleVoltar = () => {
    irParaEtapa(3);
    router.push("/manifestacao/anexos");
  };

  const handleRecomecar = () => {
    const confirmado = window.confirm(
      "Tem certeza que deseja recomeçar? Todos os dados serão apagados."
    );
    if (confirmado) {
      resetar();
      router.push("/manifestacao/relato");
    }
  };

  return (
    <WizardLayout etapaAtual={etapaAtual}>
      {/* Mensagem da IZA */}
      <IzaContainer mensagem={getMensagemIza()} variante="lupa" />

      {/* Informação sobre identificação */}
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-lg mb-6",
          podeSerAnonimo ? "bg-info/10" : "bg-warning/10"
        )}
      >
        {podeSerAnonimo ? (
          <ShieldCheck className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
        ) : (
          <User className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        )}
        <div className="text-sm">
          {podeSerAnonimo ? (
            <>
              <p className="font-medium text-info">
                Você pode enviar de forma anônima
              </p>
              <p className="text-foreground mt-1">
                Este tipo de manifestação permite registro anônimo. Se
                preferir, você pode se identificar para receber acompanhamento
                da sua solicitação.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-warning">
                Identificação obrigatória
              </p>
              <p className="text-foreground mt-1">
                Para este tipo de manifestação, precisamos dos seus dados para
                dar uma resposta adequada e personalizada.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Formulário */}
      <IdentificacaoForm
        initialData={manifestacao.identificacao}
        onChange={handleIdentificacaoChange}
        permiteAnonimo={podeSerAnonimo}
        anonimo={anonimo}
        onAnonimoChange={handleAnonimoChange}
      />

      {/* Navegação */}
      <NavigationButtons
        etapaAtual={4}
        totalEtapas={5}
        podeAvancar={podeAvancar()}
        podeVoltar={true}
        onVoltar={handleVoltar}
        onAvancar={handleAvancar}
        onRecomecar={handleRecomecar}
        className="mt-8"
      />
    </WizardLayout>
  );
}
