// Geração de Protocolo - PWA Ouvidoria DF
// Formato compatível com o sistema real do Participa DF

/**
 * Gera número de protocolo no formato do Participa DF
 * Formato: AAAA.MMDD.XXXXXXXX
 * Exemplo: 2026.0120.00001234
 */
export function gerarProtocolo(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  // Gera sequencial de 8 dígitos baseado em timestamp + random
  const timestamp = agora.getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  const sequencial = (timestamp + random).padStart(8, "0");

  return `${ano}.${mes}${dia}.${sequencial}`;
}

/**
 * Valida formato de protocolo
 */
export function validarProtocolo(protocolo: string): boolean {
  const regex = /^\d{4}\.\d{4}\.\d{8}$/;
  return regex.test(protocolo);
}

/**
 * Extrai informações do protocolo
 */
export function parseProtocolo(protocolo: string): {
  ano: number;
  mes: number;
  dia: number;
  sequencial: string;
} | null {
  if (!validarProtocolo(protocolo)) return null;

  const [anoStr, dataStr, sequencial] = protocolo.split(".");
  const ano = parseInt(anoStr);
  const mes = parseInt(dataStr.slice(0, 2));
  const dia = parseInt(dataStr.slice(2, 4));

  return { ano, mes, dia, sequencial };
}

/**
 * Formata protocolo para exibição amigável
 */
export function formatarProtocolo(protocolo: string): string {
  if (!validarProtocolo(protocolo)) return protocolo;

  const info = parseProtocolo(protocolo);
  if (!info) return protocolo;

  return `${info.ano}.${String(info.mes).padStart(2, "0")}${String(info.dia).padStart(2, "0")}.${info.sequencial}`;
}

/**
 * Gera URL para acompanhamento de protocolo
 * Configurável para URL real do sistema
 */
export function gerarUrlAcompanhamento(protocolo: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_PROTOCOLO_URL ||
    "https://www.participa.df.gov.br/consulta";

  return `${baseUrl}?protocolo=${encodeURIComponent(protocolo)}`;
}

/**
 * Gera QR Code URL para protocolo
 * Usa API pública do Google Charts
 */
export function gerarQRCodeUrl(protocolo: string, tamanho = 200): string {
  const url = gerarUrlAcompanhamento(protocolo);
  return `https://chart.googleapis.com/chart?cht=qr&chs=${tamanho}x${tamanho}&chl=${encodeURIComponent(url)}`;
}
