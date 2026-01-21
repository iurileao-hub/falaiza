"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type PhotoCaptureStatus =
  | "idle"
  | "requesting"
  | "ready"
  | "captured"
  | "error";

export interface PhotoCaptureOptions {
  /** Usar câmera frontal ou traseira */
  facingMode?: "user" | "environment";
  /** Qualidade da imagem (0-1) */
  quality?: number;
  /** Largura máxima da imagem */
  maxWidth?: number;
  /** Altura máxima da imagem */
  maxHeight?: number;
  /** Formato da imagem */
  format?: "image/jpeg" | "image/png" | "image/webp";
  /** Callback de erro */
  onError?: (error: Error) => void;
}

export interface PhotoCaptureResult {
  /** Status atual */
  status: PhotoCaptureStatus;
  /** Blob da foto */
  blob: Blob | null;
  /** URL do blob para preview */
  url: string | null;
  /** Stream de vídeo ativo */
  stream: MediaStream | null;
  /** Mensagem de erro */
  error: string | null;
  /** Elemento de vídeo para preview */
  videoRef: React.RefObject<HTMLVideoElement>;
  /** Solicitar permissão e preparar câmera */
  prepare: () => Promise<void>;
  /** Capturar foto */
  capture: () => void;
  /** Resetar para estado inicial */
  reset: () => void;
  /** Trocar câmera (frontal/traseira) */
  switchCamera: () => Promise<void>;
  /** Verificar se suporta múltiplas câmeras */
  canSwitchCamera: boolean;
  /** Verificar se o navegador suporta captura */
  isSupported: boolean;
}

export function usePhotoCapture(
  options: PhotoCaptureOptions = {}
): PhotoCaptureResult {
  const {
    facingMode: initialFacingMode = "environment",
    quality = 0.92,
    maxWidth = 1920,
    maxHeight = 1080,
    format = "image/jpeg",
    onError,
  } = options;

  const [status, setStatus] = useState<PhotoCaptureStatus>("idle");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    initialFacingMode
  );
  const [canSwitchCamera, setCanSwitchCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Verificar suporte do navegador
  const isSupported =
    typeof window !== "undefined" &&
    !!navigator.mediaDevices &&
    !!navigator.mediaDevices.getUserMedia;

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

  // Limpar recursos
  const cleanup = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      cleanup();
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [cleanup, url]);

  // Solicitar permissão e preparar câmera
  const prepare = useCallback(async () => {
    if (!isSupported) {
      const errorMsg = "Seu navegador não suporta captura de fotos.";
      setError(errorMsg);
      setStatus("error");
      onError?.(new Error(errorMsg));
      return;
    }

    // Limpar recursos anteriores
    cleanup();
    if (url) {
      URL.revokeObjectURL(url);
      setUrl(null);
    }
    setBlob(null);

    setStatus("requesting");
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: maxWidth },
          height: { ideal: maxHeight },
        },
        audio: false,
      });

      setStream(mediaStream);

      // Conectar ao elemento de vídeo
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setStatus("ready");
    } catch (err) {
      let errorMsg = "Erro ao acessar a câmera.";

      if (err instanceof Error) {
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          errorMsg =
            "Permissão negada para acessar a câmera. Por favor, permita o acesso nas configurações do navegador.";
        } else if (
          err.name === "NotFoundError" ||
          err.name === "DevicesNotFoundError"
        ) {
          errorMsg = "Nenhuma câmera encontrada no dispositivo.";
        } else if (err.name === "NotReadableError") {
          errorMsg = "A câmera está sendo usada por outro aplicativo.";
        }
      }

      setError(errorMsg);
      setStatus("error");
      onError?.(new Error(errorMsg));
    }
  }, [
    isSupported,
    cleanup,
    url,
    facingMode,
    maxWidth,
    maxHeight,
    onError,
  ]);

  // Capturar foto
  const capture = useCallback(() => {
    if (status !== "ready" || !videoRef.current || !stream) {
      return;
    }

    const video = videoRef.current;

    // Criar canvas se não existir
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      const errorMsg = "Erro ao processar a imagem.";
      setError(errorMsg);
      setStatus("error");
      onError?.(new Error(errorMsg));
      return;
    }

    // Definir dimensões do canvas
    let width = video.videoWidth;
    let height = video.videoHeight;

    // Redimensionar se necessário
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    // Desenhar frame do vídeo no canvas
    ctx.drawImage(video, 0, 0, width, height);

    // Converter para blob
    canvas.toBlob(
      (capturedBlob) => {
        if (capturedBlob) {
          // Limpar URL anterior
          if (url) {
            URL.revokeObjectURL(url);
          }

          setBlob(capturedBlob);
          setUrl(URL.createObjectURL(capturedBlob));
          setStatus("captured");

          // Parar stream após captura
          cleanup();
        } else {
          const errorMsg = "Erro ao capturar a foto.";
          setError(errorMsg);
          setStatus("error");
          onError?.(new Error(errorMsg));
        }
      },
      format,
      quality
    );
  }, [status, stream, maxWidth, maxHeight, format, quality, url, cleanup, onError]);

  // Trocar câmera
  const switchCamera = useCallback(async () => {
    if (!canSwitchCamera) return;

    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);

    // Reabrir câmera com novo facing mode
    cleanup();
    setStatus("requesting");

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacingMode,
          width: { ideal: maxWidth },
          height: { ideal: maxHeight },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setStatus("ready");
    } catch (err) {
      const errorMsg = "Erro ao trocar de câmera.";
      setError(errorMsg);
      setStatus("error");
      onError?.(new Error(errorMsg));
    }
  }, [canSwitchCamera, facingMode, cleanup, maxWidth, maxHeight, onError]);

  // Resetar para estado inicial
  const reset = useCallback(() => {
    cleanup();
    if (url) {
      URL.revokeObjectURL(url);
    }
    setStatus("idle");
    setBlob(null);
    setUrl(null);
    setStream(null);
    setError(null);
  }, [cleanup, url]);

  return {
    status,
    blob,
    url,
    stream,
    error,
    videoRef,
    prepare,
    capture,
    reset,
    switchCamera,
    canSwitchCamera,
    isSupported,
  };
}
