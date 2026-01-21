"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileText,
  User,
  MessageSquare,
  Paperclip,
  Copy,
  Check,
} from "lucide-react";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { IzaContainer } from "@/components/iza/IzaContainer";
import { Button } from "@/components/ui/button";
import { useManifestacaoStore } from "@/stores/manifestacaoStore";
import { TIPOS_MANIFESTACAO, CATEGORIAS_ASSUNTO, PRAZOS_RESPOSTA } from "@/lib/constants";
import { MENSAGENS_IZA } from "@/lib/iza-messages";
import { cn } from "@/lib/utils";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function ConfirmacaoPage() {
  const router = useRouter();
  const {
    manifestacao,
    anexos,
    setProtocolo,
    setStatus,
    resetar,
    etapaAtual,
    irParaEtapa,
  } = useManifestacaoStore();

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [protocolo, setProtocoloLocal] = useState("");
  const [copied, setCopied] = useState(false);

  // Obter informações do tipo
  const tipoInfo = TIPOS_MANIFESTACAO.find((t) => t.id === manifestacao.tipo);
  const categoriaInfo = CATEGORIAS_ASSUNTO.find(
    (c) => c.id === manifestacao.assunto?.categoria
  );
  const prazoResposta = manifestacao.tipo
    ? PRAZOS_RESPOSTA[manifestacao.tipo]
    : null;

  // Calcular tamanho total dos anexos
  const tamanhoTotalAnexos = anexos.reduce((acc, a) => acc + a.tamanho, 0);

  // Determinar mensagem da IZA
  const getMensagemIza = () => {
    if (submitStatus === "success") {
      return `${MENSAGENS_IZA.confirmacao.sucesso} ${MENSAGENS_IZA.confirmacao.protocolo(protocolo)}`;
    }
    if (submitStatus === "error") {
      return MENSAGENS_IZA.confirmacao.erro;
    }
    return MENSAGENS_IZA.confirmacao.inicial;
  };

  // Enviar manifestação
  const handleSubmit = async () => {
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      // Preparar dados para envio
      const dadosEnvio = {
        tipo: manifestacao.tipo,
        assunto: manifestacao.assunto,
        relato: manifestacao.relato || "", // Garante string vazia se undefined
        anonimo: manifestacao.anonimo ?? false,
        identificacao: manifestacao.anonimo ? null : manifestacao.identificacao,
        anexos: anexos.map((a) => ({
          nome: a.nome,
          tipo: a.tipo,
          tamanho: a.tamanho,
          gravadoNativo: a.gravadoNativo ?? false,
        })),
      };

      // Chamar API
      const response = await fetch("/api/manifestacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosEnvio),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao enviar manifestação");
      }

      const data = await response.json();

      // Atualizar store
      setProtocolo(data.protocolo);
      setStatus("enviada");
      setProtocoloLocal(data.protocolo);
      setSubmitStatus("success");
    } catch (error) {
      console.error("Erro ao enviar:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Erro desconhecido"
      );
      setSubmitStatus("error");
    }
  };

  // Copiar protocolo
  const handleCopyProtocolo = async () => {
    try {
      await navigator.clipboard.writeText(protocolo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback para navegadores sem suporte
      const textArea = document.createElement("textarea");
      textArea.value = protocolo;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Nova manifestação
  const handleNovaManifestaçao = () => {
    resetar();
    router.push("/manifestacao/tipo?nova=true");
  };

  // Voltar
  const handleVoltar = () => {
    irParaEtapa(5);
    router.push("/manifestacao/identificacao");
  };

  // Tela de sucesso
  if (submitStatus === "success") {
    return (
      <WizardLayout etapaAtual={6}>
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">
              Manifestação enviada com sucesso!
            </h2>
            <p className="text-muted">
              Guarde o número do protocolo para acompanhar sua manifestação.
            </p>
          </div>

          {/* Protocolo */}
          <div className="bg-surface border rounded-lg p-6">
            <p className="text-sm text-muted mb-2">Número do protocolo</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono font-bold">{protocolo}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyProtocolo}
                className="text-muted"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-success" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Prazo de resposta */}
          {prazoResposta && (
            <div className="bg-info/10 rounded-lg p-4 text-sm">
              <p>
                <strong>Prazo para resposta:</strong> {prazoResposta.padrao} dias
                úteis
                {!manifestacao.anonimo && (
                  <span>
                    . Você receberá atualizações no e-mail{" "}
                    <strong>{manifestacao.identificacao?.email}</strong>.
                  </span>
                )}
              </p>
            </div>
          )}

          {/* IZA */}
          <IzaContainer
            mensagem={getMensagemIza()}
            variante="sucesso"
          />

          {/* Ações */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={handleNovaManifestaçao}>
              Nova manifestação
            </Button>
            <Button onClick={() => router.push("/")}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </WizardLayout>
    );
  }

  // Tela de resumo (antes do envio)
  return (
    <WizardLayout etapaAtual={etapaAtual}>
      {/* Mensagem da IZA */}
      <IzaContainer mensagem={getMensagemIza()} variante="default" />

      {/* Erro */}
      {submitStatus === "error" && (
        <div
          className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-lg mb-6"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-error">Erro ao enviar</p>
            <p className="text-sm text-foreground mt-1">{errorMessage}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSubmit}
              className="mt-3"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {/* Resumo */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Resumo da manifestação</h2>

        {/* Tipo */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted">Tipo</p>
              <p className="font-medium">
                {tipoInfo?.icone} {tipoInfo?.nome}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/manifestacao/tipo")}
              className="text-primary"
            >
              Editar
            </Button>
          </div>
        </div>

        {/* Assunto */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-xl flex-shrink-0">{categoriaInfo?.icone}</div>
            <div className="flex-1">
              <p className="text-sm text-muted">Assunto</p>
              <p className="font-medium">{manifestacao.assunto?.descricao}</p>
              <p className="text-sm text-muted">{categoriaInfo?.nome}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/manifestacao/assunto")}
              className="text-primary"
            >
              Editar
            </Button>
          </div>
        </div>

        {/* Relato */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted">Relato</p>
              <p className="font-medium line-clamp-3">
                {manifestacao.relato || "(Sem texto)"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/manifestacao/relato")}
              className="text-primary"
            >
              Editar
            </Button>
          </div>
        </div>

        {/* Anexos */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Paperclip className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted">Anexos</p>
              <p className="font-medium">
                {anexos.length > 0
                  ? `${anexos.length} arquivo(s) • ${(tamanhoTotalAnexos / (1024 * 1024)).toFixed(1)} MB`
                  : "Nenhum anexo"}
              </p>
              {anexos.length > 0 && (
                <ul className="text-sm text-muted mt-1">
                  {anexos.slice(0, 3).map((anexo) => (
                    <li key={anexo.id}>• {anexo.nome}</li>
                  ))}
                  {anexos.length > 3 && (
                    <li>• e mais {anexos.length - 3} arquivo(s)</li>
                  )}
                </ul>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/manifestacao/anexos")}
              className="text-primary"
            >
              Editar
            </Button>
          </div>
        </div>

        {/* Identificação */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted">Identificação</p>
              {manifestacao.anonimo ? (
                <p className="font-medium">Anônimo</p>
              ) : (
                <>
                  <p className="font-medium">
                    {manifestacao.identificacao?.nome}
                  </p>
                  <p className="text-sm text-muted">
                    {manifestacao.identificacao?.email}
                  </p>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/manifestacao/identificacao")}
              className="text-primary"
            >
              Editar
            </Button>
          </div>
        </div>
      </div>

      {/* Prazo de resposta */}
      {prazoResposta && (
        <div className="mt-6 p-4 bg-info/10 rounded-lg text-sm">
          <p>
            <strong>Prazo estimado para resposta:</strong> {prazoResposta.padrao}{" "}
            dias úteis após o envio.
          </p>
        </div>
      )}

      {/* Botões de ação */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          onClick={handleVoltar}
          disabled={submitStatus === "loading"}
        >
          Voltar
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={submitStatus === "loading"}
          className={cn(
            "bg-success hover:bg-success/90",
            submitStatus === "loading" && "opacity-70"
          )}
          size="lg"
        >
          {submitStatus === "loading" ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Enviar manifestação
            </>
          )}
        </Button>
      </div>
    </WizardLayout>
  );
}
