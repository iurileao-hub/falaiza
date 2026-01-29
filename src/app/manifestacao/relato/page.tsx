"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { NavigationButtons } from "@/components/wizard/NavigationButtons";
import { IzaContainer } from "@/components/iza/IzaContainer";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MediaToolbar } from "@/components/media/MediaToolbar";
import { MediaPreview } from "@/components/media/MediaPreview";
import { useManifestacaoStore } from "@/stores/manifestacaoStore";
import { MENSAGENS_IZA } from "@/lib/iza-messages";
import { VALIDACOES, MEDIA_CONFIG } from "@/lib/constants";
import { cn, gerarId } from "@/lib/utils";
import { PreviewAnexo, TipoAnexo } from "@/types/anexo";

export default function RelatoPage() {
  const router = useRouter();
  const {
    manifestacao,
    anexos,
    setRelato,
    adicionarAnexo,
    removerAnexo,
    podeAvancar,
    etapaAtual,
    irParaEtapa,
    resetar,
  } = useManifestacaoStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado local para digitação instantânea, com debounce para persistência no store
  const [relatoLocal, setRelatoLocal] = useState(manifestacao.relato || "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincronizar estado local quando o store muda externamente (ex: reset)
  useEffect(() => {
    setRelatoLocal(manifestacao.relato || "");
  }, [manifestacao.relato]);

  // Debounce: persiste no store após 300ms sem digitação
  const handleRelatoChange = useCallback(
    (valor: string) => {
      setRelatoLocal(valor);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        setRelato(valor);
      }, 300);
    },
    [setRelato]
  );

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const relato = relatoLocal;
  const caracteresRestantes = VALIDACOES.relato.minimo - relato.length;
  const temTextoSuficiente = relato.length >= VALIDACOES.relato.minimo;
  const temMidia = anexos.length > 0;
  const podeEnviar = temTextoSuficiente || temMidia;

  // Calcular tamanho total dos anexos
  const tamanhoTotal = anexos.reduce((acc, a) => acc + a.tamanho, 0);
  const tamanhoMaximo = MEDIA_CONFIG.totalMaxSize;
  const espacoRestante = tamanhoMaximo - tamanhoTotal;

  // Determinar mensagem da IZA
  const getMensagemIza = () => {
    if (temMidia || temTextoSuficiente) {
      return MENSAGENS_IZA.relato.dicaFoto;
    }
    if (relato.length > 0 && !temTextoSuficiente) {
      return MENSAGENS_IZA.relato.caracteresRestantes(caracteresRestantes);
    }
    return MENSAGENS_IZA.relato.inicial;
  };

  // Adicionar mídia gravada
  const handleAudioRecorded = useCallback(
    (blob: Blob, duration: number) => {
      const anexo: PreviewAnexo = {
        id: gerarId(),
        nome: `audio-${Date.now()}.webm`,
        tipo: "audio" as TipoAnexo,
        tamanho: blob.size,
        url: URL.createObjectURL(blob),
        duracao: duration,
        gravadoNativo: true,
      };
      adicionarAnexo(anexo);
    },
    [adicionarAnexo]
  );

  const handleVideoRecorded = useCallback(
    (blob: Blob, duration: number) => {
      const anexo: PreviewAnexo = {
        id: gerarId(),
        nome: `video-${Date.now()}.webm`,
        tipo: "video" as TipoAnexo,
        tamanho: blob.size,
        url: URL.createObjectURL(blob),
        duracao: duration,
        gravadoNativo: true,
      };
      adicionarAnexo(anexo);
    },
    [adicionarAnexo]
  );

  const handlePhotoCaptured = useCallback(
    (blob: Blob) => {
      const anexo: PreviewAnexo = {
        id: gerarId(),
        nome: `foto-${Date.now()}.jpg`,
        tipo: "foto" as TipoAnexo,
        tamanho: blob.size,
        url: URL.createObjectURL(blob),
        gravadoNativo: true,
      };
      adicionarAnexo(anexo);
    },
    [adicionarAnexo]
  );

  const handleFileSelected = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handler para input de arquivo
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        // Determinar tipo
        let tipo: TipoAnexo = "documento";
        if (file.type.startsWith("image/")) tipo = "foto";
        else if (file.type.startsWith("video/")) tipo = "video";
        else if (file.type.startsWith("audio/")) tipo = "audio";

        const anexo: PreviewAnexo = {
          id: gerarId(),
          nome: file.name,
          tipo,
          tamanho: file.size,
          url: URL.createObjectURL(file),
          gravadoNativo: false,
        };
        adicionarAnexo(anexo);
      });

      // Reset input para permitir selecionar o mesmo arquivo novamente
      e.target.value = "";
    },
    [adicionarAnexo]
  );

  const handleRemoverAnexo = useCallback(
    (id: string) => {
      const anexo = anexos.find((a) => a.id === id);
      if (anexo?.url) {
        URL.revokeObjectURL(anexo.url);
      }
      removerAnexo(id);
    },
    [anexos, removerAnexo]
  );

  // Persiste imediatamente o relato local no store (flush do debounce)
  const flushRelato = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setRelato(relatoLocal);
  }, [relatoLocal, setRelato]);

  // Novo fluxo: Relato é etapa 1, próxima é Sugestão (etapa 2)
  const handleAvancar = () => {
    flushRelato();
    if (podeAvancar()) {
      irParaEtapa(2);
      router.push("/manifestacao/sugestao");
    }
  };

  const handleVoltar = () => {
    // Etapa 1 - voltar para início
    irParaEtapa(1);
    router.push("/manifestacao");
  };

  const handleRecomecar = () => {
    const confirmado = window.confirm(
      "Tem certeza que deseja recomeçar? Seu relato atual será apagado."
    );
    if (confirmado) {
      resetar();
      // Resetar estado local explicitamente (router.push para mesma URL é no-op)
      setRelatoLocal("");
      // Usar replace + query param para forçar re-render no Next.js
      router.replace("/manifestacao/relato?nova=true");
    }
  };

  return (
    <WizardLayout etapaAtual={etapaAtual}>
      {/* Mensagem da IZA */}
      <IzaContainer mensagem={getMensagemIza()} variante="default" />

      {/* Área de relato */}
      <div className="space-y-4">
        {/* Textarea com label acessível */}
        <div className="space-y-2">
          <Label htmlFor="relato" className="sr-only">
            Descreva sua manifestação
          </Label>
          <Textarea
            id="relato"
            placeholder="Descreva sua manifestação aqui. Seja o mais detalhado possível para que possamos ajudá-lo melhor..."
            value={relato}
            onChange={(e) => handleRelatoChange(e.target.value)}
            className={cn(
              "min-h-[200px] resize-y",
              !podeEnviar && relato.length > 0 && "border-warning"
            )}
            maxLength={VALIDACOES.relato.maximo}
            aria-describedby="relato-hint relato-counter"
            aria-invalid={!podeEnviar && relato.length > 0}
          />

          {/* Contador de caracteres */}
          <div
            id="relato-counter"
            className="flex justify-between text-sm text-muted"
          >
            <span>
              {relato.length} / {VALIDACOES.relato.maximo} caracteres
            </span>
            {!temTextoSuficiente && !temMidia && relato.length > 0 && (
              <span className="text-warning">
                Mínimo: mais {caracteresRestantes} caracteres
              </span>
            )}
          </div>

          {/* Dica */}
          <p id="relato-hint" className="text-sm text-muted">
            {temMidia
              ? "Você pode adicionar texto para complementar sua mídia, ou enviar apenas a mídia."
              : `Escreva pelo menos ${VALIDACOES.relato.minimo} caracteres ou adicione uma mídia (áudio, vídeo ou foto).`}
          </p>
        </div>

        {/* Barra de mídia */}
        <MediaToolbar
          onAudioRecorded={handleAudioRecorded}
          onVideoRecorded={handleVideoRecorded}
          onPhotoCaptured={handlePhotoCaptured}
          onFileSelected={handleFileSelected}
          disabled={tamanhoTotal >= tamanhoMaximo}
        />

        {/* Input de arquivo visualmente oculto mas sempre presente no DOM */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileInputChange}
          className="sr-only"
          aria-label="Selecionar arquivos para anexar"
          tabIndex={-1}
        />

        {/* Preview de anexos */}
        {anexos.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">
              Anexos ({anexos.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {anexos.map((anexo) => (
                <MediaPreview
                  key={anexo.id}
                  anexo={anexo}
                  onRemove={() => handleRemoverAnexo(anexo.id)}
                  compact={anexos.length > 3}
                />
              ))}
            </div>

            {/* Indicador de espaço */}
            <div className="text-sm text-muted">
              {tamanhoTotal > 0 && (
                <span>
                  {(tamanhoTotal / (1024 * 1024)).toFixed(1)} MB de{" "}
                  {(tamanhoMaximo / (1024 * 1024)).toFixed(0)} MB usados
                </span>
              )}
              {espacoRestante < 5 * 1024 * 1024 && espacoRestante > 0 && (
                <span className="text-warning ml-2">
                  • Pouco espaço restante
                </span>
              )}
              {espacoRestante <= 0 && (
                <span className="text-error ml-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Limite atingido
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navegação */}
      <NavigationButtons
        etapaAtual={1}
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
