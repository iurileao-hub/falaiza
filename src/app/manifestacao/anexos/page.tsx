"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Info, Trash2 } from "lucide-react";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { NavigationButtons } from "@/components/wizard/NavigationButtons";
import { IzaContainer } from "@/components/iza/IzaContainer";
import { Button } from "@/components/ui/button";
import { FileUploadArea } from "@/components/media/FileUploadArea";
import { MediaPreview } from "@/components/media/MediaPreview";
import { useManifestacaoStore } from "@/stores/manifestacaoStore";
import { MENSAGENS_IZA } from "@/lib/iza-messages";
import { MEDIA_CONFIG, FORMATOS_ACEITOS } from "@/lib/constants";
import { PreviewAnexo, TipoAnexo } from "@/types/anexo";
import type { UploadedFile } from "@/hooks/useFileUpload";

const generateId = () =>
  `anexo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const mapUploadedFileToAnexo = (file: UploadedFile): PreviewAnexo => {
  const tipoMap: Record<UploadedFile["type"], TipoAnexo> = {
    image: "foto",
    video: "video",
    audio: "audio",
    document: "documento",
  };

  return {
    id: file.id,
    nome: file.name,
    tipo: tipoMap[file.type],
    tamanho: file.size,
    url: file.url,
    gravadoNativo: false,
  };
};

export default function AnexosPage() {
  const router = useRouter();
  const {
    anexos,
    adicionarAnexo,
    removerAnexo,
    limparAnexos,
    podeAvancar,
    etapaAtual,
    irParaEtapa,
    resetar,
  } = useManifestacaoStore();

  // Calcular tamanho total
  const tamanhoTotal = anexos.reduce((acc, a) => acc + a.tamanho, 0);
  const tamanhoMaximo = MEDIA_CONFIG.totalMaxSize;
  const percentualUsado = Math.round((tamanhoTotal / tamanhoMaximo) * 100);

  // Determinar mensagem da IZA
  const getMensagemIza = () => {
    if (anexos.length === 0) {
      return MENSAGENS_IZA.anexos.inicial;
    }
    return MENSAGENS_IZA.anexos.adicionado(anexos.length);
  };

  // Handler para arquivos adicionados pelo FileUploadArea
  const handleFilesChange = useCallback(
    (files: UploadedFile[]) => {
      // Adicionar novos arquivos que ainda não existem
      files.forEach((file) => {
        const existeNoStore = anexos.some((a) => a.id === file.id);
        if (!existeNoStore) {
          const anexo = mapUploadedFileToAnexo(file);
          adicionarAnexo(anexo);
        }
      });
    },
    [anexos, adicionarAnexo]
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

  const handleLimparTodos = useCallback(() => {
    anexos.forEach((anexo) => {
      if (anexo.url) {
        URL.revokeObjectURL(anexo.url);
      }
    });
    limparAnexos();
  }, [anexos, limparAnexos]);

  // Novo fluxo: Anexos é etapa 3, próxima é Identificação (etapa 4)
  const handleAvancar = () => {
    irParaEtapa(4);
    router.push("/manifestacao/identificacao");
  };

  const handleVoltar = () => {
    irParaEtapa(2);
    router.push("/manifestacao/sugestao");
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
      <IzaContainer mensagem={getMensagemIza()} variante="default" />

      {/* Informação sobre anexos */}
      <div className="flex items-start gap-3 p-4 bg-info/10 rounded-lg mb-6">
        <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-info">Esta etapa é opcional</p>
          <p className="text-foreground mt-1">
            Você pode adicionar documentos, fotos ou outros arquivos que
            complementem sua manifestação. Se não tiver nada a adicionar,
            pode avançar para a próxima etapa.
          </p>
        </div>
      </div>

      {/* Área de upload */}
      <FileUploadArea
        existingFiles={anexos.map((a) => ({
          id: a.id,
          file: new File([], a.nome),
          url: a.url,
          type:
            a.tipo === "foto"
              ? "image"
              : a.tipo === "video"
                ? "video"
                : a.tipo === "audio"
                  ? "audio"
                  : "document",
          name: a.nome,
          size: a.tamanho,
        }))}
        onFilesChange={handleFilesChange}
        accept={[
          ...FORMATOS_ACEITOS.imagens,
          ...FORMATOS_ACEITOS.documentos,
          ...FORMATOS_ACEITOS.audio,
          ...FORMATOS_ACEITOS.video,
        ]}
        maxFiles={10}
        className="mb-6"
      />

      {/* Lista de anexos */}
      {anexos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Arquivos anexados ({anexos.length})
            </h3>
            {anexos.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLimparTodos}
                className="text-error hover:text-error/80"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remover todos
              </Button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {anexos.map((anexo) => (
              <MediaPreview
                key={anexo.id}
                anexo={anexo}
                onRemove={() => handleRemoverAnexo(anexo.id)}
                compact={false}
              />
            ))}
          </div>

          {/* Barra de progresso de espaço */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Espaço utilizado</span>
              <span
                className={
                  percentualUsado > 90 ? "text-error font-medium" : "text-muted"
                }
              >
                {(tamanhoTotal / (1024 * 1024)).toFixed(1)} MB de{" "}
                {(tamanhoMaximo / (1024 * 1024)).toFixed(0)} MB
              </span>
            </div>
            <div
              className="h-2 bg-muted/20 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={percentualUsado}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Espaço utilizado"
            >
              <div
                className={`h-full transition-all ${
                  percentualUsado > 90
                    ? "bg-error"
                    : percentualUsado > 70
                      ? "bg-warning"
                      : "bg-success"
                }`}
                style={{ width: `${Math.min(percentualUsado, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Formatos aceitos */}
      <details className="mt-6 text-sm">
        <summary className="cursor-pointer text-muted hover:text-foreground">
          Ver formatos e limites aceitos
        </summary>
        <div className="mt-3 p-4 bg-surface rounded-lg space-y-3">
          <div>
            <p className="font-medium mb-1">Imagens</p>
            <p className="text-muted">
              JPEG, PNG, GIF, WebP • Máx. {MEDIA_CONFIG.photo.maxSize / (1024 * 1024)} MB cada
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Vídeos</p>
            <p className="text-muted">
              MP4, WebM, MOV • Máx. {MEDIA_CONFIG.video.maxSize / (1024 * 1024)} MB •{" "}
              {(MEDIA_CONFIG.video.maxDuration || 0) / 60000} min
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Áudios</p>
            <p className="text-muted">
              MP3, WAV, WebM, OGG • Máx. {MEDIA_CONFIG.audio.maxSize / (1024 * 1024)} MB •{" "}
              {(MEDIA_CONFIG.audio.maxDuration || 0) / 60000} min
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">Documentos</p>
            <p className="text-muted">
              PDF, DOC, DOCX, TXT • Máx. {MEDIA_CONFIG.document.maxSize / (1024 * 1024)} MB cada
            </p>
          </div>
          <div className="pt-2 border-t">
            <p className="font-medium">
              Limite total: {tamanhoMaximo / (1024 * 1024)} MB
            </p>
          </div>
        </div>
      </details>

      {/* Navegação */}
      <NavigationButtons
        etapaAtual={3}
        totalEtapas={5}
        podeAvancar={true} // Etapa opcional
        podeVoltar={true}
        onVoltar={handleVoltar}
        onAvancar={handleAvancar}
        onRecomecar={handleRecomecar}
        className="mt-8"
      />
    </WizardLayout>
  );
}
