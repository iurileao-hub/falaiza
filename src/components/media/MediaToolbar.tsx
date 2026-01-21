"use client";

import { useState } from "react";
import { Mic, Video, Camera, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioRecorder } from "./AudioRecorder";
import { VideoRecorder } from "./VideoRecorder";
import { PhotoCapture } from "./PhotoCapture";
import { cn } from "@/lib/utils";

type MediaMode = "none" | "audio" | "video" | "photo" | "file";

interface MediaToolbarProps {
  /** Callback quando áudio é gravado */
  onAudioRecorded?: (blob: Blob, duration: number) => void;
  /** Callback quando vídeo é gravado */
  onVideoRecorded?: (blob: Blob, duration: number) => void;
  /** Callback quando foto é capturada */
  onPhotoCaptured?: (blob: Blob) => void;
  /** Callback quando arquivo é selecionado */
  onFileSelected?: () => void;
  /** Desabilitar toolbar */
  disabled?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

export function MediaToolbar({
  onAudioRecorded,
  onVideoRecorded,
  onPhotoCaptured,
  onFileSelected,
  disabled = false,
  className,
}: MediaToolbarProps) {
  const [mode, setMode] = useState<MediaMode>("none");

  const handleAudioRecorded = (blob: Blob, duration: number) => {
    onAudioRecorded?.(blob, duration);
    setMode("none");
  };

  const handleVideoRecorded = (blob: Blob, duration: number) => {
    onVideoRecorded?.(blob, duration);
    setMode("none");
  };

  const handlePhotoCaptured = (blob: Blob) => {
    onPhotoCaptured?.(blob);
    setMode("none");
  };

  const handleCancel = () => {
    setMode("none");
  };

  // Se está em modo de captura, mostrar o componente correspondente
  if (mode !== "none") {
    return (
      <div className={cn("border rounded-lg bg-white", className)}>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-medium text-sm">
            {mode === "audio" && "Gravar áudio"}
            {mode === "video" && "Gravar vídeo"}
            {mode === "photo" && "Tirar foto"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {mode === "audio" && (
          <AudioRecorder
            onRecorded={handleAudioRecorded}
            onCancel={handleCancel}
          />
        )}

        {mode === "video" && (
          <VideoRecorder
            onRecorded={handleVideoRecorded}
            onCancel={handleCancel}
          />
        )}

        {mode === "photo" && (
          <PhotoCapture
            onCaptured={handlePhotoCaptured}
            onCancel={handleCancel}
          />
        )}
      </div>
    );
  }

  // Barra de ferramentas normal
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 border rounded-lg bg-surface",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      role="toolbar"
      aria-label="Ferramentas de mídia"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode("audio")}
        disabled={disabled}
        className="flex items-center gap-2"
        aria-label="Gravar áudio"
      >
        <Mic className="h-5 w-5" />
        <span className="hidden sm:inline">Áudio</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode("video")}
        disabled={disabled}
        className="flex items-center gap-2"
        aria-label="Gravar vídeo"
      >
        <Video className="h-5 w-5" />
        <span className="hidden sm:inline">Vídeo</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode("photo")}
        disabled={disabled}
        className="flex items-center gap-2"
        aria-label="Tirar foto"
      >
        <Camera className="h-5 w-5" />
        <span className="hidden sm:inline">Foto</span>
      </Button>

      <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onFileSelected}
        disabled={disabled}
        className="flex items-center gap-2"
        aria-label="Anexar arquivo"
      >
        <Paperclip className="h-5 w-5" />
        <span className="hidden sm:inline">Anexar</span>
      </Button>
    </div>
  );
}
