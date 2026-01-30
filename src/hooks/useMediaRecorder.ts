"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type MediaRecorderStatus =
  | "idle"
  | "requesting"
  | "ready"
  | "recording"
  | "paused"
  | "stopped"
  | "error";

export interface MediaRecorderOptions {
  /** Tipo de mídia: audio ou video */
  mediaType: "audio" | "video";
  /** Duração máxima em segundos */
  maxDuration?: number;
  /** Callback quando atingir duração máxima */
  onMaxDurationReached?: () => void;
  /** Callback de erro */
  onError?: (error: Error) => void;
  /** Qualidade do vídeo (para video) */
  videoQuality?: "low" | "medium" | "high";
  /** Usar câmera frontal ou traseira (para video) */
  facingMode?: "user" | "environment";
}

export interface MediaRecorderResult {
  /** Status atual do gravador */
  status: MediaRecorderStatus;
  /** Blob da gravação */
  blob: Blob | null;
  /** URL do blob para preview */
  url: string | null;
  /** Duração da gravação em segundos */
  duration: number;
  /** Stream de mídia ativo */
  stream: MediaStream | null;
  /** Mensagem de erro */
  error: string | null;
  /** Solicitar permissão e preparar gravação */
  prepare: () => Promise<void>;
  /** Iniciar gravação */
  start: () => void;
  /** Pausar gravação */
  pause: () => void;
  /** Retomar gravação */
  resume: () => void;
  /** Parar gravação */
  stop: () => void;
  /** Resetar para estado inicial */
  reset: () => void;
  /** Verificar se o navegador suporta gravação */
  isSupported: boolean;
}

const getVideoConstraints = (
  quality: "low" | "medium" | "high",
  facingMode: "user" | "environment"
): MediaTrackConstraints => {
  const constraints: Record<string, MediaTrackConstraints> = {
    low: { width: 640, height: 480, frameRate: 15, facingMode },
    medium: { width: 1280, height: 720, frameRate: 24, facingMode },
    high: { width: 1920, height: 1080, frameRate: 30, facingMode },
  };
  return constraints[quality];
};

const getMimeType = (mediaType: "audio" | "video"): string => {
  if (mediaType === "audio") {
    // Prioridade: webm > mp4 > ogg
    if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
      return "audio/webm;codecs=opus";
    }
    if (MediaRecorder.isTypeSupported("audio/mp4")) {
      return "audio/mp4";
    }
    if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
      return "audio/ogg;codecs=opus";
    }
    return "audio/webm";
  }

  // Para vídeo
  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")) {
    return "video/webm;codecs=vp9,opus";
  }
  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
    return "video/webm;codecs=vp8,opus";
  }
  if (MediaRecorder.isTypeSupported("video/mp4")) {
    return "video/mp4";
  }
  return "video/webm";
};

export function useMediaRecorder(
  options: MediaRecorderOptions
): MediaRecorderResult {
  const {
    mediaType,
    maxDuration,
    onMaxDurationReached,
    onError,
    videoQuality = "medium",
    facingMode = "user",
  } = options;

  const [status, setStatus] = useState<MediaRecorderStatus>("idle");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Verificar suporte do navegador
  const isSupported =
    typeof window !== "undefined" &&
    !!navigator.mediaDevices &&
    !!navigator.mediaDevices.getUserMedia &&
    !!window.MediaRecorder;

  // Limpar recursos
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // Ignorar erro se já parou
        }
      }
      mediaRecorderRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }, [stream]);

  // Limpar URL anterior ao criar nova
  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      cleanup();
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [cleanup, url]);

  // Solicitar permissão e preparar gravação
  const prepare = useCallback(async () => {
    if (!isSupported) {
      const errorMsg = "Seu navegador não suporta gravação de mídia.";
      setError(errorMsg);
      setStatus("error");
      onError?.(new Error(errorMsg));
      return;
    }

    setStatus("requesting");
    setError(null);

    try {
      const constraints: MediaStreamConstraints =
        mediaType === "audio"
          ? { audio: true }
          : {
              audio: true,
              video: getVideoConstraints(videoQuality, facingMode),
            };

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setStatus("ready");
    } catch (err) {
      let errorMsg = "Erro ao acessar dispositivo de mídia.";

      if (err instanceof Error) {
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          errorMsg = `Permissão negada para acessar ${mediaType === "audio" ? "o microfone" : "a câmera"}. Por favor, permita o acesso nas configurações do navegador.`;
        } else if (
          err.name === "NotFoundError" ||
          err.name === "DevicesNotFoundError"
        ) {
          errorMsg = `Nenhum ${mediaType === "audio" ? "microfone" : "câmera"} encontrado no dispositivo.`;
        } else if (err.name === "NotReadableError") {
          errorMsg = `O ${mediaType === "audio" ? "microfone" : "câmera"} está sendo usado por outro aplicativo.`;
        }
      }

      setError(errorMsg);
      setStatus("error");
      onError?.(new Error(errorMsg));
    }
  }, [isSupported, mediaType, videoQuality, facingMode, onError]);

  // Iniciar gravação
  const start = useCallback(() => {
    if (!stream || status !== "ready") {
      return;
    }

    chunksRef.current = [];
    setBlob(null);
    if (url) {
      URL.revokeObjectURL(url);
      setUrl(null);
    }

    const mimeType = getMimeType(mediaType);
    const recorder = new MediaRecorder(stream, { mimeType });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const recordedBlob = new Blob(chunksRef.current, { type: mimeType });
      setBlob(recordedBlob);
      setUrl(URL.createObjectURL(recordedBlob));
      setStatus("stopped");

      // Limpar timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    recorder.onerror = () => {
      const errorMsg = "Erro durante a gravação.";
      setError(errorMsg);
      setStatus("error");
      onError?.(new Error(errorMsg));
    };

    mediaRecorderRef.current = recorder;
    const CHUNK_INTERVAL_MS = 1000;
    recorder.start(CHUNK_INTERVAL_MS);

    startTimeRef.current = Date.now();
    setDuration(0);
    setStatus("recording");

    // Timer para atualizar duração
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setDuration(elapsed);

      // Verificar duração máxima
      if (maxDuration && elapsed >= maxDuration) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        recorder.stop();
        onMaxDurationReached?.();
      }
    }, 1000); // Atualizar a cada segundo para melhor performance
  }, [stream, status, mediaType, url, maxDuration, onMaxDurationReached, onError]);

  // Pausar gravação
  const pause = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setStatus("paused");
    }
  }, []);

  // Retomar gravação
  const resume = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();

      // Ajustar tempo de início para manter duração correta
      const pausedDuration = duration;
      startTimeRef.current = Date.now() - pausedDuration * 1000;

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);

        if (maxDuration && elapsed >= maxDuration) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          mediaRecorderRef.current?.stop();
          onMaxDurationReached?.();
        }
      }, 100);

      setStatus("recording");
    }
  }, [duration, maxDuration, onMaxDurationReached]);

  // Parar gravação
  const stop = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Resetar para estado inicial
  const reset = useCallback(() => {
    cleanup();
    if (url) {
      URL.revokeObjectURL(url);
    }
    setStatus("idle");
    setBlob(null);
    setUrl(null);
    setDuration(0);
    setStream(null);
    setError(null);
    chunksRef.current = [];
  }, [cleanup, url]);

  return {
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
  };
}
