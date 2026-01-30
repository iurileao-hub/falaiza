"use client";

import { X, Play, Pause, Film, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatarTamanhoArquivo, formatarTempo } from "@/lib/utils";
import React, { useState, useRef } from "react";
import { PreviewAnexo } from "@/types/anexo";

interface MediaPreviewProps {
  /** Anexo para preview */
  anexo: PreviewAnexo;
  /** Callback para remover */
  onRemove?: () => void;
  /** Modo compacto */
  compact?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

function MediaPreviewInner({
  anexo,
  onRemove,
  compact = false,
  className,
}: MediaPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = () => {
    const media = anexo.tipo === "audio" ? audioRef.current : videoRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  // Preview de foto
  if (anexo.tipo === "foto") {
    return (
      <div
        className={cn(
          "relative group rounded-lg overflow-hidden bg-black",
          compact ? "w-20 h-20" : "w-full max-w-xs",
          className
        )}
      >
        <img
          src={anexo.url}
          alt={anexo.nome}
          className={cn(
            "object-cover w-full h-full",
            compact ? "h-20" : "max-h-48"
          )}
        />
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Remover ${anexo.nome}`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {!compact && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
            {formatarTamanhoArquivo(anexo.tamanho)}
          </div>
        )}
      </div>
    );
  }

  // Preview de áudio
  if (anexo.tipo === "audio") {
    return (
      <div
        className={cn(
          "relative flex items-center gap-3 p-3 bg-surface rounded-lg",
          compact && "p-2",
          className
        )}
      >
        <audio
          ref={audioRef}
          src={anexo.url}
          onEnded={handleEnded}
          className="hidden"
        />

        <button
          onClick={togglePlayPause}
          className={cn(
            "flex items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90",
            compact ? "w-8 h-8" : "w-12 h-12"
          )}
          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? (
            <Pause className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
          ) : (
            <Play className={cn(compact ? "h-4 w-4" : "h-5 w-5", "ml-0.5")} />
          )}
        </button>

        {!compact && (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{anexo.nome}</p>
            <p className="text-xs text-muted">
              {anexo.duracao ? formatarTempo(anexo.duracao) : ""} •{" "}
              {formatarTamanhoArquivo(anexo.tamanho)}
            </p>
          </div>
        )}

        {compact && (
          <Music className="h-4 w-4 text-muted" />
        )}

        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className={cn(
              "text-muted hover:text-error",
              compact && "h-6 w-6 p-0"
            )}
            aria-label={`Remover ${anexo.nome}`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // Preview de vídeo
  if (anexo.tipo === "video") {
    return (
      <div
        className={cn(
          "relative group rounded-lg overflow-hidden bg-black",
          compact ? "w-20 h-20" : "w-full max-w-xs",
          className
        )}
      >
        {compact ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <Film className="h-8 w-8 text-muted" />
          </div>
        ) : (
          <video
            ref={videoRef}
            src={anexo.url}
            onEnded={handleEnded}
            className="w-full max-h-48 object-contain"
            controls={false}
            onClick={togglePlayPause}
          />
        )}

        {!compact && !isPlaying && (
          <button
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            aria-label="Reproduzir vídeo"
          >
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-black ml-1" />
            </div>
          </button>
        )}

        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Remover ${anexo.nome}`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {!compact && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 flex justify-between">
            <span>{anexo.duracao ? formatarTempo(anexo.duracao) : ""}</span>
            <span>{formatarTamanhoArquivo(anexo.tamanho)}</span>
          </div>
        )}
      </div>
    );
  }

  // Preview de documento/outro
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 p-3 bg-surface rounded-lg",
        compact && "p-2",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded bg-muted/20",
          compact ? "w-8 h-8" : "w-10 h-10"
        )}
      >
        <Film className={cn(compact ? "h-4 w-4" : "h-5 w-5", "text-muted")} />
      </div>

      {!compact && (
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{anexo.nome}</p>
          <p className="text-xs text-muted">{formatarTamanhoArquivo(anexo.tamanho)}</p>
        </div>
      )}

      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className={cn("text-muted hover:text-error", compact && "h-6 w-6 p-0")}
          aria-label={`Remover ${anexo.nome}`}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export const MediaPreview = React.memo(MediaPreviewInner);
