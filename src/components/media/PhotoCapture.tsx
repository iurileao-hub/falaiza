"use client";

import { useEffect } from "react";
import {
  Camera,
  CameraOff,
  Trash2,
  Check,
  SwitchCamera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePhotoCapture } from "@/hooks/usePhotoCapture";
import { cn } from "@/lib/utils";

interface PhotoCaptureProps {
  /** Callback quando foto é capturada */
  onCaptured: (blob: Blob) => void;
  /** Callback para cancelar */
  onCancel: () => void;
  /** Classes CSS adicionais */
  className?: string;
}

export function PhotoCapture({
  onCaptured,
  onCancel,
  className,
}: PhotoCaptureProps) {
  const {
    status,
    blob,
    url,
    error,
    videoRef,
    prepare,
    capture,
    reset,
    switchCamera,
    canSwitchCamera,
    isSupported,
  } = usePhotoCapture({
    facingMode: "environment",
    quality: 0.92,
    maxWidth: 1920,
    maxHeight: 1080,
  });

  // Preparar ao montar
  useEffect(() => {
    prepare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Confirmar foto
  const handleConfirm = () => {
    if (blob) {
      onCaptured(blob);
    }
  };

  // Descartar e recomeçar
  const handleDiscard = () => {
    reset();
    prepare();
  };

  if (!isSupported) {
    return (
      <div
        className={cn("p-6 bg-error/10 rounded-lg text-center", className)}
        role="alert"
      >
        <CameraOff className="h-12 w-12 mx-auto mb-4 text-error" />
        <p className="text-error font-medium">
          Seu navegador não suporta captura de fotos.
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
        <CameraOff className="h-12 w-12 mx-auto mb-4 text-error" />
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
          <Camera className="h-12 w-12 mx-auto mb-4 text-primary" />
          <p className="text-muted">Solicitando acesso à câmera...</p>
        </div>
      </div>
    );
  }

  // Estado de foto capturada
  if (status === "captured" && blob && url) {
    return (
      <div className={cn("p-4 space-y-4", className)}>
        <div className="text-center">
          <p className="font-medium mb-2">Foto capturada</p>
        </div>

        {/* Preview da foto */}
        <div className="relative">
          <img
            src={url}
            alt="Foto capturada"
            className="w-full max-h-64 object-contain rounded-lg bg-black"
          />
        </div>

        {/* Ações */}
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={handleDiscard}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Tirar outra
          </Button>
          <Button
            variant="success"
            onClick={handleConfirm}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Usar esta foto
          </Button>
        </div>
      </div>
    );
  }

  // Estado pronto para capturar
  return (
    <div className={cn("space-y-4", className)}>
      {/* Preview da câmera */}
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full max-h-64 rounded-lg bg-black object-cover"
          aria-label="Visualização da câmera"
        />

        {/* Botão trocar câmera */}
        {canSwitchCamera && (
          <Button
            variant="ghost"
            size="sm"
            onClick={switchCamera}
            className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
            aria-label="Trocar câmera"
          >
            <SwitchCamera className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Controles */}
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          onClick={capture}
          size="lg"
          className="flex items-center gap-2"
        >
          <Camera className="h-5 w-5" />
          Tirar foto
        </Button>
      </div>

      {/* Dica */}
      <p className="text-xs text-center text-muted">
        Posicione a câmera e clique para capturar.
      </p>
    </div>
  );
}
