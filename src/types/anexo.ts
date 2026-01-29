// Tipos para Anexos e Mídia - FalaIZA

import { TipoAnexo } from "./manifestacao";

// Re-export for convenience
export type { TipoAnexo };

/** Status da gravação de mídia */
export type StatusGravacao =
  | "idle"
  | "requesting"
  | "ready"
  | "recording"
  | "paused"
  | "stopped"
  | "error";

/** Configurações de mídia */
export interface ConfiguracaoMidia {
  mimeType: string;
  maxDuration?: number; // em milissegundos
  maxSize: number; // em bytes
  quality?: number; // 0 a 1 para imagens
  constraints?: MediaStreamConstraints;
}

/** Configurações gerais de upload */
export interface ConfiguracaoUpload {
  audio: ConfiguracaoMidia;
  video: ConfiguracaoMidia;
  photo: ConfiguracaoMidia;
  document: {
    accept: string;
    maxSize: number;
  };
  totalMaxSize: number;
}

/** Informações de preview de anexo */
export interface PreviewAnexo {
  id: string;
  tipo: TipoAnexo;
  nome: string;
  tamanho: number;
  duracao?: number;
  url: string; // URL.createObjectURL
  thumbnail?: string;
  gravadoNativo?: boolean; // Se foi gravado nativamente pelo app
}

/** Estado do hook de gravação de mídia */
export interface EstadoGravacaoMidia {
  status: StatusGravacao;
  duration: number; // em segundos
  blob: Blob | null;
  error: Error | null;
  stream: MediaStream | null;
}

/** Ações do hook de gravação de mídia */
export interface AcoesGravacaoMidia {
  requestPermission: () => Promise<void>;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

/** Retorno completo do hook useMediaRecorder */
export type UseMediaRecorderReturn = EstadoGravacaoMidia & AcoesGravacaoMidia;

/** Opções para o hook useMediaRecorder */
export interface OpcoesMediaRecorder {
  type: "audio" | "video";
  onDataAvailable?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}
