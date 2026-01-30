"use client";

import { useEffect, useRef, useState } from "react";
import {
  Video,
  VideoOff,
  Square,
  Pause,
  Play,
  Trash2,
  Check,
  SwitchCamera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { MEDIA_CONFIG } from "@/lib/constants";
import { cn, formatarTempo } from "@/lib/utils";

interface VideoRecorderProps {
  /** Callback quando vídeo é gravado */
  onRecorded: (blob: Blob, duration: number) => void;
  /** Callback para cancelar */
  onCancel: () => void;
  /** Classes CSS adicionais */
  className?: string;
}

export function VideoRecorder({
  onRecorded,
  onCancel,
  className,
}: VideoRecorderProps) {
  const maxDuration = (MEDIA_CONFIG.video.maxDuration || 120000) / 1000; // Convert ms to seconds, default 2 min
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [canSwitchCamera, setCanSwitchCamera] = useState(false);

  const {
    status,
    blob,
    url,
    duration,
    stream,
    error,
    prepare,
    start,
    pause,
    resume,
    stop,
    reset,
    isSupported,
  } = useMediaRecorder({
    mediaType: "video",
    maxDuration,
    facingMode,
    videoQuality: "medium",
  });

  const previewRef = useRef<HTMLVideoElement>(null);
  const playbackRef = useRef<HTMLVideoElement>(null);

  // Verificar se tem múltiplas câmeras
  useEffect(() => {
    const checkCameras = async () => {
      if (!navigator.mediaDevices?.enumerateDevices) {
        setCanSwitchCamera(false);
        return;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setCanSwitchCamera(videoDevices.length > 1);
      } catch {
        setCanSwitchCamera(false);
      }
    };

    checkCameras();
  }, []);

  // Preparar ao montar - executar apenas uma vez, não ao alterar prepare
  useEffect(() => {
    prepare();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prepare apenas no mount
  }, []);

  // Conectar stream ao preview
  useEffect(() => {
    if (previewRef.current && stream) {
      previewRef.current.srcObject = stream;
      previewRef.current.play().catch(() => {
        // Ignorar erro de autoplay
      });
    }
  }, [stream]);

  // Trocar câmera
  const handleSwitchCamera = async () => {
    if (!canSwitchCamera) return;

    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);

    // Reset e preparar com nova câmera
    reset();
    // O prepare será chamado pelo useEffect quando facingMode mudar
  };

  // Re-preparar quando facingMode mudar
  useEffect(() => {
    if (status === "idle") {
      prepare();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-preparar ao trocar câmera
  }, [facingMode]);

  // Confirmar gravação
  const handleConfirm = () => {
    if (blob) {
      onRecorded(blob, duration);
    }
  };

  // Descartar e recomeçar
  const handleDiscard = () => {
    reset();
    prepare();
  };

  const progressPercent = Math.min((duration / maxDuration) * 100, 100);
  const remainingTime = maxDuration - duration;

  if (!isSupported) {
    return (
      <div
        className={cn("p-6 bg-error/10 rounded-lg text-center", className)}
        role="alert"
      >
        <VideoOff className="h-12 w-12 mx-auto mb-4 text-error" />
        <p className="text-error font-medium">
          Seu navegador não suporta gravação de vídeo.
        </p>
        <p className="text-sm text-muted mt-2">
          Tente usar Chrome, Firefox ou Safari atualizados.
        </p>
        <Button variant="outline" onClick={onCancel} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn("p-6 bg-error/10 rounded-lg text-center", className)}
        role="alert"
      >
        <VideoOff className="h-12 w-12 mx-auto mb-4 text-error" />
        <p className="text-error font-medium">{error}</p>
        <div className="flex gap-2 justify-center mt-4">
          <Button variant="outline" onClick={onCancel}>
            Voltar
          </Button>
          <Button onClick={() => prepare()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  // Estado de carregamento
  if (status === "idle" || status === "requesting") {
    return (
      <div
        className={cn("p-6 text-center", className)}
        role="status"
        aria-live="polite"
      >
        <div className="animate-pulse">
          <Video className="h-12 w-12 mx-auto mb-4 text-primary" />
          <p className="text-muted">Solicitando acesso à câmera...</p>
        </div>
      </div>
    );
  }

  // Estado de gravação concluída
  if (status === "stopped" && blob && url) {
    return (
      <div className={cn("p-4 space-y-4", className)}>
        <div className="text-center">
          <p className="font-medium mb-2">Gravação concluída</p>
          <p className="text-sm text-muted">Duração: {formatarTempo(duration)}</p>
        </div>

        {/* Player de vídeo */}
        <video
          ref={playbackRef}
          src={url}
          controls
          className="w-full max-h-64 rounded-lg bg-black"
          aria-label="Pré-visualização do vídeo gravado"
        />

        {/* Ações */}
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={handleDiscard}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Descartar
          </Button>
          <Button
            variant="success"
            onClick={handleConfirm}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Usar este vídeo
          </Button>
        </div>
      </div>
    );
  }

  // Estado pronto para gravar ou gravando
  return (
    <div className={cn("space-y-4", className)}>
      {/* Preview da câmera */}
      <div className="relative">
        <video
          ref={previewRef}
          autoPlay
          muted
          playsInline
          className={cn(
            "w-full max-h-64 rounded-lg bg-black",
            facingMode === "user" && "scale-x-[-1]" // Espelhar câmera frontal
          )}
          aria-label="Visualização da câmera"
        />

        {/* Indicador de gravação */}
        {status === "recording" && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
            <span className="w-3 h-3 bg-error rounded-full animate-pulse" />
            <span className="text-white text-sm font-mono">
              {formatarTempo(duration)}
            </span>
          </div>
        )}

        {/* Botão trocar câmera */}
        {canSwitchCamera && status === "ready" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwitchCamera}
            className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
            aria-label="Trocar câmera"
          >
            <SwitchCamera className="h-5 w-5" />
          </Button>
        )}

        {/* Status pausado */}
        {status === "paused" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <div className="text-white text-center">
              <Pause className="h-12 w-12 mx-auto mb-2" />
              <p className="font-medium">Pausado</p>
            </div>
          </div>
        )}
      </div>

      {/* Barra de progresso */}
      {(status === "recording" || status === "paused") && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted">
              {status === "paused" ? "Pausado" : "Gravando..."}
            </span>
            <span className="text-muted">
              Restam {formatarTempo(remainingTime)}
            </span>
          </div>
          <div
            className="h-2 bg-muted/20 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={cn(
                "h-full transition-all duration-200",
                status === "recording" && "bg-error",
                status === "paused" && "bg-warning"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="flex gap-3 justify-center">
        {status === "ready" && (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              onClick={start}
              size="lg"
              className="flex items-center gap-2 bg-error hover:bg-error/90"
            >
              <Video className="h-5 w-5" />
              Iniciar gravação
            </Button>
          </>
        )}

        {status === "recording" && (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={pause}
              className="flex items-center gap-2"
            >
              <Pause className="h-5 w-5" />
              Pausar
            </Button>
            <Button
              onClick={stop}
              size="lg"
              className="flex items-center gap-2"
            >
              <Square className="h-5 w-5" />
              Parar
            </Button>
          </>
        )}

        {status === "paused" && (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDiscard}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-5 w-5" />
              Descartar
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={resume}
              className="flex items-center gap-2"
            >
              <Play className="h-5 w-5" />
              Continuar
            </Button>
            <Button
              onClick={stop}
              size="lg"
              className="flex items-center gap-2"
            >
              <Square className="h-5 w-5" />
              Finalizar
            </Button>
          </>
        )}
      </div>

      {/* Dica */}
      <p className="text-xs text-center text-muted">
        {status === "ready" &&
          `Máximo de ${formatarTempo(maxDuration)}. Clique para iniciar.`}
        {status === "recording" && "Gravando... Fique estável para melhor qualidade."}
        {status === "paused" && "Gravação pausada. Continue ou finalize."}
      </p>
    </div>
  );
}
