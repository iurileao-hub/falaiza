"use client";

import { useEffect, useRef } from "react";
import { Mic, MicOff, Square, Pause, Play, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { MEDIA_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  /** Callback quando áudio é gravado */
  onRecorded: (blob: Blob, duration: number) => void;
  /** Callback para cancelar */
  onCancel: () => void;
  /** Classes CSS adicionais */
  className?: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function AudioRecorder({
  onRecorded,
  onCancel,
  className,
}: AudioRecorderProps) {
  const maxDuration = (MEDIA_CONFIG.audio.maxDuration || 300000) / 1000; // Convert ms to seconds, default 5 min

  const {
    status,
    blob,
    url,
    duration,
    error,
    prepare,
    start,
    pause,
    resume,
    stop,
    reset,
    isSupported,
  } = useMediaRecorder({
    mediaType: "audio",
    maxDuration,
    onMaxDurationReached: () => {
      // Será tratado pelo useEffect
    },
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  // Preparar ao montar
  useEffect(() => {
    prepare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <MicOff className="h-12 w-12 mx-auto mb-4 text-error" />
        <p className="text-error font-medium">
          Seu navegador não suporta gravação de áudio.
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
        <MicOff className="h-12 w-12 mx-auto mb-4 text-error" />
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
          <Mic className="h-12 w-12 mx-auto mb-4 text-primary" />
          <p className="text-muted">Solicitando acesso ao microfone...</p>
        </div>
      </div>
    );
  }

  // Estado de gravação concluída
  if (status === "stopped" && blob && url) {
    return (
      <div className={cn("p-6 space-y-4", className)}>
        <div className="text-center">
          <p className="font-medium mb-2">Gravação concluída</p>
          <p className="text-sm text-muted">Duração: {formatTime(duration)}</p>
        </div>

        {/* Player de áudio */}
        <audio
          ref={audioRef}
          src={url}
          controls
          className="w-full"
          aria-label="Pré-visualização do áudio gravado"
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
            Usar este áudio
          </Button>
        </div>
      </div>
    );
  }

  // Estado pronto para gravar ou gravando
  return (
    <div className={cn("p-6 space-y-6", className)}>
      {/* Indicador visual */}
      <div className="text-center">
        <div
          className={cn(
            "inline-flex items-center justify-center w-24 h-24 rounded-full transition-all",
            status === "recording" && "bg-error/20 animate-pulse",
            status === "paused" && "bg-warning/20",
            status === "ready" && "bg-primary/10"
          )}
        >
          <Mic
            className={cn(
              "h-12 w-12 transition-colors",
              status === "recording" && "text-error",
              status === "paused" && "text-warning",
              status === "ready" && "text-primary"
            )}
          />
        </div>
      </div>

      {/* Timer e progresso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span
            className={cn(
              "font-mono text-lg",
              status === "recording" && "text-error font-bold"
            )}
          >
            {formatTime(duration)}
          </span>
          <span className="text-muted">
            {status === "recording" && `Restam ${formatTime(remainingTime)}`}
            {status === "ready" && `Máximo: ${formatTime(maxDuration)}`}
            {status === "paused" && "Pausado"}
          </span>
        </div>

        {/* Barra de progresso */}
        <div
          className="h-2 bg-muted/20 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso da gravação"
        >
          <div
            className={cn(
              "h-full transition-all duration-200",
              status === "recording" && "bg-error",
              status === "paused" && "bg-warning",
              progressPercent > 90 && "bg-error"
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

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
              <Mic className="h-5 w-5" />
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
      <p className="text-xs text-center text-muted" aria-live="polite">
        {status === "ready" &&
          "Clique para iniciar a gravação. O áudio será gravado localmente."}
        {status === "recording" &&
          "Gravando... Fale próximo ao microfone para melhor qualidade."}
        {status === "paused" && "Gravação pausada. Continue ou finalize."}
      </p>
    </div>
  );
}
