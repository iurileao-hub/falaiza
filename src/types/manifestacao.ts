// Tipos para Manifestação - FalaIZA

/** Tipos de manifestação disponíveis */
export type TipoManifestacao =
  | "reclamacao"
  | "denuncia"
  | "sugestao"
  | "elogio"
  | "solicitacao"
  | "informacao";

/** Status da manifestação no sistema */
export type StatusManifestacao = "rascunho" | "pendente" | "enviada" | "erro";

/** Tipos de anexo suportados */
export type TipoAnexo = "audio" | "video" | "foto" | "documento";

/** Categorias de assunto */
export type CategoriaAssunto =
  | "saude"
  | "educacao"
  | "transporte"
  | "seguranca"
  | "obras"
  | "saneamento"
  | "meio-ambiente"
  | "documentos"
  | "assistencia-social"
  | "outro";

/** Configuração de um tipo de manifestação */
export interface ConfiguracaoTipoManifestacao {
  id: TipoManifestacao;
  nome: string;
  icone: string;
  descricao: string;
  permiteAnonimo: boolean;
}

/** Configuração de uma categoria de assunto */
export interface ConfiguracaoCategoria {
  id: CategoriaAssunto;
  nome: string;
  icone: string;
}

/** Dados de assunto da manifestação */
export interface AssuntoManifestacao {
  categoria: CategoriaAssunto;
  subcategoria?: string;
  descricao?: string;
}

/** Dados de identificação do cidadão */
export interface IdentificacaoCidadao {
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  notificacoes: boolean;
}

/** Estrutura completa de uma manifestação */
export interface Manifestacao {
  id?: number;
  status: StatusManifestacao;
  etapaAtual: number;
  tipo: TipoManifestacao | null;
  assunto: AssuntoManifestacao | null;
  relato: string;
  anonimo: boolean;
  identificacao: IdentificacaoCidadao | null;
  protocolo?: string;
  criadoEm: Date;
  atualizadoEm: Date;
  enviadoEm?: Date;
}

/** Estrutura de um anexo */
export interface Anexo {
  id?: number;
  manifestacaoId: number;
  tipo: TipoAnexo;
  nome: string;
  mimeType: string;
  tamanho: number;
  duracao?: number; // Para áudio e vídeo, em segundos
  blob: Blob;
  thumbnail?: Blob;
  criadoEm: Date;
}

/** Estado do wizard de manifestação */
export interface EstadoWizard {
  etapaAtual: number;
  totalEtapas: number;
  podeAvancar: boolean;
  podeVoltar: boolean;
  etapasCompletas: number[];
}

/** Resposta da API ao enviar manifestação */
export interface RespostaEnvioManifestacao {
  success: boolean;
  protocolo?: string;
  mensagem: string;
  prazoResposta?: string;
  erro?: string;
}
