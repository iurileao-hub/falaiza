// Utilitários - PWA Ouvidoria DF

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge de classes Tailwind com resolução de conflitos
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata CPF com máscara
 */
export function formatarCPF(cpf: string): string {
  const numeros = cpf.replace(/\D/g, "");
  return numeros
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

/**
 * Formata telefone com máscara
 */
export function formatarTelefone(telefone: string): string {
  const numeros = telefone.replace(/\D/g, "");
  if (numeros.length <= 10) {
    return numeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 14);
  }
  return numeros
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
}

/**
 * Valida CPF
 */
export function validarCPF(cpf: string): boolean {
  const numeros = cpf.replace(/\D/g, "");

  if (numeros.length !== 11) return false;
  if (/^(\d)\1+$/.test(numeros)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros[i]) * (10 - i);
  }
  let digito = 11 - (soma % 11);
  if (digito > 9) digito = 0;
  if (parseInt(numeros[9]) !== digito) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros[i]) * (11 - i);
  }
  digito = 11 - (soma % 11);
  if (digito > 9) digito = 0;
  if (parseInt(numeros[10]) !== digito) return false;

  return true;
}

/**
 * Formata tamanho de arquivo em bytes para string legível
 */
export function formatarTamanhoArquivo(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const tamanhos = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + tamanhos[i];
}

/**
 * Formata duração em segundos para string MM:SS
 */
export function formatarDuracao(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const segs = Math.floor(segundos % 60);
  return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
}

/**
 * Formata data para exibição
 */
export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}

/**
 * Formata data para exibição curta
 */
export function formatarDataCurta(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(data);
}

/**
 * Gera ID único
 */
export function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Debounce para otimização de eventos
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle para limitar frequência de chamadas
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Sleep/delay assíncrono
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Verifica se está em ambiente de navegador
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Verifica se está em modo de desenvolvimento
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Verifica suporte a funcionalidades
 */
export const suporta = {
  mediaRecorder: () =>
    isBrowser() && "MediaRecorder" in window,

  serviceWorker: () =>
    isBrowser() && "serviceWorker" in navigator,

  indexedDB: () =>
    isBrowser() && "indexedDB" in window,

  geolocation: () =>
    isBrowser() && "geolocation" in navigator,

  notifications: () =>
    isBrowser() && "Notification" in window,

  vibration: () =>
    isBrowser() && "vibrate" in navigator,

  share: () =>
    isBrowser() && "share" in navigator,

  clipboard: () =>
    isBrowser() && "clipboard" in navigator,
};

/**
 * Trunca texto com reticências
 */
export function truncarTexto(texto: string, maxLength: number): string {
  if (texto.length <= maxLength) return texto;
  return texto.slice(0, maxLength - 3) + "...";
}

/**
 * Remove acentos de string
 */
export function removerAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Busca fuzzy simples
 */
export function buscaFuzzy(texto: string, busca: string): boolean {
  const textoNorm = removerAcentos(texto.toLowerCase());
  const buscaNorm = removerAcentos(busca.toLowerCase());

  return textoNorm.includes(buscaNorm);
}

/**
 * Copia texto para clipboard
 */
export async function copiarParaClipboard(texto: string): Promise<boolean> {
  if (!suporta.clipboard()) return false;

  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

/**
 * Compartilhar via Web Share API
 */
export async function compartilhar(dados: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<boolean> {
  if (!suporta.share()) return false;

  try {
    await navigator.share(dados);
    return true;
  } catch {
    return false;
  }
}

/**
 * Revoga um blob URL de forma segura, ignorando erros se já foi revogado
 */
export function revokeObjectURLSafely(url: string | null | undefined): void {
  if (url) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignorar se já foi revogado
    }
  }
}

/**
 * Formata tempo em segundos para string MM:SS
 * Útil para gravação de áudio/vídeo
 */
export function formatarTempo(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Mapeia tipo de anexo para tipo de arquivo de upload
 */
export function mapTipoAnexoToFileType(
  tipo: string
): "image" | "video" | "audio" | "document" {
  const map: Record<string, "image" | "video" | "audio" | "document"> = {
    foto: "image",
    video: "video",
    audio: "audio",
    documento: "document",
  };
  return map[tipo] || "document";
}
