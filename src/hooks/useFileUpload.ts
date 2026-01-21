"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { MEDIA_CONFIG, FORMATOS_ACEITOS } from "@/lib/constants";

export interface FileUploadOptions {
  /** Tipos MIME aceitos */
  accept?: string[];
  /** Tamanho máximo por arquivo em bytes */
  maxSize?: number;
  /** Máximo de arquivos */
  maxFiles?: number;
  /** Callback de erro */
  onError?: (error: string) => void;
}

export interface UploadedFile {
  id: string;
  file: File;
  url: string;
  type: "image" | "video" | "audio" | "document";
  name: string;
  size: number;
  error?: string;
}

export interface FileUploadResult {
  /** Arquivos selecionados */
  files: UploadedFile[];
  /** Adicionar arquivos */
  addFiles: (fileList: FileList | File[]) => void;
  /** Remover arquivo */
  removeFile: (id: string) => void;
  /** Limpar todos os arquivos */
  clearFiles: () => void;
  /** Verificar tamanho total */
  totalSize: number;
  /** Verificar se excedeu limite */
  isOverLimit: boolean;
  /** Erro geral */
  error: string | null;
  /** Referência do input */
  inputRef: React.RefObject<HTMLInputElement>;
  /** Abrir seletor de arquivos */
  openFileSelector: () => void;
}

const generateId = () =>
  `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getFileType = (
  file: File
): "image" | "video" | "audio" | "document" => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "document";
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const validateFile = (
  file: File,
  options: FileUploadOptions
): string | null => {
  const { accept, maxSize } = options;

  // Verificar tipo
  if (accept && accept.length > 0) {
    const isValidType = accept.some((type) => {
      if (type.endsWith("/*")) {
        // Wildcard type (e.g., "image/*")
        const baseType = type.replace("/*", "");
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Tipo de arquivo não permitido: ${file.type || "desconhecido"}`;
    }
  }

  // Verificar tamanho
  if (maxSize && file.size > maxSize) {
    return `Arquivo muito grande: ${formatFileSize(file.size)}. Máximo: ${formatFileSize(maxSize)}`;
  }

  return null;
};

export function useFileUpload(
  options: FileUploadOptions = {}
): FileUploadResult {
  const {
    accept = [...FORMATOS_ACEITOS.imagens, ...FORMATOS_ACEITOS.documentos],
    maxSize = MEDIA_CONFIG.document.maxSize,
    maxFiles = 10,
    onError,
  } = options;

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null!);

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const isOverLimit = totalSize > MEDIA_CONFIG.totalMaxSize;

  // Cleanup blob URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        try {
          URL.revokeObjectURL(f.url);
        } catch {
          // Ignore errors during cleanup
        }
      });
    };
  }, [files]);

  // Adicionar arquivos
  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const newFiles: UploadedFile[] = [];
      const errors: string[] = [];

      Array.from(fileList).forEach((file) => {
        // Verificar limite de arquivos
        if (files.length + newFiles.length >= maxFiles) {
          errors.push(`Limite de ${maxFiles} arquivos atingido.`);
          return;
        }

        // Validar arquivo
        const validationError = validateFile(file, { accept, maxSize });
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
          return;
        }

        // Verificar tamanho total
        const currentTotal = files.reduce((acc, f) => acc + f.size, 0);
        const pendingTotal = newFiles.reduce((acc, f) => acc + f.size, 0);
        if (
          currentTotal + pendingTotal + file.size >
          MEDIA_CONFIG.totalMaxSize
        ) {
          errors.push(
            `Limite total de ${formatFileSize(MEDIA_CONFIG.totalMaxSize)} excedido.`
          );
          return;
        }

        try {
          newFiles.push({
            id: generateId(),
            file,
            url: URL.createObjectURL(file),
            type: getFileType(file),
            name: file.name,
            size: file.size,
          });
        } catch (urlError) {
          errors.push(`${file.name}: Erro ao processar arquivo`);
          if (process.env.NODE_ENV === "development") {
            console.error("URL.createObjectURL failed:", urlError);
          }
        }
      });

      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles]);
      }

      if (errors.length > 0) {
        const errorMsg = errors.join("\n");
        setError(errorMsg);
        onError?.(errorMsg);
      } else {
        setError(null);
      }
    },
    [files, maxFiles, accept, maxSize, onError]
  );

  // Remover arquivo
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter((f) => f.id !== id);
    });
    setError(null);
  }, []);

  // Limpar todos os arquivos
  const clearFiles = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
    setError(null);
  }, [files]);

  // Abrir seletor de arquivos
  const openFileSelector = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
    totalSize,
    isOverLimit,
    error,
    inputRef,
    openFileSelector,
  };
}
