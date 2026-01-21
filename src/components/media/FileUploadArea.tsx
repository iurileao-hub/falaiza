"use client";

import { useCallback, useState, useMemo } from "react";
import { Upload, X, File, Image, Film, Music, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileUpload, type UploadedFile } from "@/hooks/useFileUpload";
import { MEDIA_CONFIG, FORMATOS_ACEITOS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FileUploadAreaProps {
  /** Arquivos já adicionados */
  existingFiles?: UploadedFile[];
  /** Callback quando arquivos são adicionados */
  onFilesChange: (files: UploadedFile[]) => void;
  /** Tipos aceitos */
  accept?: string[];
  /** Máximo de arquivos */
  maxFiles?: number;
  /** Classes CSS adicionais */
  className?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (type: UploadedFile["type"]) => {
  switch (type) {
    case "image":
      return Image;
    case "video":
      return Film;
    case "audio":
      return Music;
    default:
      return FileText;
  }
};

export function FileUploadArea({
  existingFiles = [],
  onFilesChange,
  accept = [
    ...FORMATOS_ACEITOS.imagens,
    ...FORMATOS_ACEITOS.documentos,
    ...FORMATOS_ACEITOS.audio,
    ...FORMATOS_ACEITOS.video,
  ],
  maxFiles = 10,
  className,
}: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);

  const {
    files,
    addFiles,
    removeFile,
    totalSize,
    isOverLimit,
    error,
    inputRef,
    openFileSelector,
  } = useFileUpload({
    accept,
    maxFiles,
  });

  // Sincronizar arquivos existentes
  const allFiles = useMemo(
    () => [...existingFiles, ...files],
    [existingFiles, files]
  );

  // Notificar mudanças
  const handleAddFiles = useCallback(
    (fileList: FileList | File[]) => {
      addFiles(fileList);
      onFilesChange([...allFiles, ...Array.from(fileList as FileList).map(() => files[files.length - 1]).filter(Boolean)]);
    },
    [addFiles, allFiles, files, onFilesChange]
  );

  const handleRemoveFile = useCallback(
    (id: string) => {
      removeFile(id);
      onFilesChange(allFiles.filter((f) => f.id !== id));
    },
    [removeFile, allFiles, onFilesChange]
  );

  // Handlers de drag and drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleAddFiles(droppedFiles);
      }
    },
    [handleAddFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        handleAddFiles(selectedFiles);
      }
      // Limpar input para permitir selecionar o mesmo arquivo novamente
      e.target.value = "";
    },
    [handleAddFiles]
  );

  const totalWithExisting =
    totalSize + existingFiles.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Input hidden */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept.join(",")}
        onChange={handleInputChange}
        className="sr-only"
        aria-label="Selecionar arquivos"
      />

      {/* Área de drop */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileSelector}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFileSelector();
          }
        }}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          "hover:border-primary hover:bg-primary/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
          isDragging && "border-primary bg-primary/10",
          isOverLimit && "border-error bg-error/5"
        )}
        aria-label="Área para arrastar e soltar arquivos ou clique para selecionar"
      >
        <Upload
          className={cn(
            "h-10 w-10 mx-auto mb-4",
            isDragging ? "text-primary" : "text-muted"
          )}
        />
        <p className="font-medium mb-1">
          {isDragging
            ? "Solte os arquivos aqui"
            : "Arraste arquivos ou clique para selecionar"}
        </p>
        <p className="text-sm text-muted">
          Imagens, documentos, áudios e vídeos • Máx. {formatFileSize(MEDIA_CONFIG.totalMaxSize)} total
        </p>
      </div>

      {/* Erro */}
      {error && (
        <div
          className="p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Indicador de tamanho total */}
      {allFiles.length > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted">
            {allFiles.length} arquivo(s) selecionado(s)
          </span>
          <span
            className={cn(
              isOverLimit ? "text-error font-medium" : "text-muted"
            )}
          >
            {formatFileSize(totalWithExisting)} /{" "}
            {formatFileSize(MEDIA_CONFIG.totalMaxSize)}
          </span>
        </div>
      )}

      {/* Lista de arquivos */}
      {allFiles.length > 0 && (
        <ul className="space-y-2" aria-label="Arquivos selecionados">
          {allFiles.map((file) => {
            const Icon = getFileIcon(file.type);

            return (
              <li
                key={file.id}
                className="flex items-center gap-3 p-3 bg-surface rounded-lg"
              >
                {/* Preview ou ícone */}
                {file.type === "image" && file.url ? (
                  <img
                    src={file.url}
                    alt=""
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-muted/10 rounded">
                    <Icon className="h-6 w-6 text-muted" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted">
                    {formatFileSize(file.size)}
                  </p>
                  {file.error && (
                    <p className="text-sm text-error">{file.error}</p>
                  )}
                </div>

                {/* Remover */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.id);
                  }}
                  className="text-muted hover:text-error"
                  aria-label={`Remover ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
