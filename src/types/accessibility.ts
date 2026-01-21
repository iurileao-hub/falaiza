// Tipos para Acessibilidade - PWA Ouvidoria DF

/** Tamanhos de fonte disponíveis */
export type TamanhoFonte = "normal" | "large" | "larger";

/** Configurações de acessibilidade do usuário */
export interface ConfiguracoesAcessibilidade {
  /** Ativar modo de alto contraste */
  altoContraste: boolean;
  /** Tamanho da fonte preferido */
  tamanhoFonte: TamanhoFonte;
  /** Reduzir animações e movimentos */
  reducaoMovimento: boolean;
}

/** Estado do painel de acessibilidade */
export interface EstadoPainelAcessibilidade {
  /** Painel está aberto/visível */
  aberto: boolean;
  /** Configurações atuais */
  configuracoes: ConfiguracoesAcessibilidade;
}

/** Anúncio para leitores de tela */
export interface AnuncioLeitorTela {
  /** Mensagem a ser anunciada */
  mensagem: string;
  /** Prioridade: "polite" para não interromper, "assertive" para urgente */
  prioridade: "polite" | "assertive";
  /** Timestamp para forçar re-anúncio */
  timestamp: number;
}

/** Configurações padrão de acessibilidade */
export const CONFIGURACOES_PADRAO: ConfiguracoesAcessibilidade = {
  altoContraste: false,
  tamanhoFonte: "normal",
  reducaoMovimento: false,
};

/** Atalhos de teclado para acessibilidade */
export const ATALHOS_ACESSIBILIDADE = {
  /** Alt + A - Abrir painel de acessibilidade */
  abrirPainel: "Alt+A",
  /** Alt + C - Ativar alto contraste */
  altoContraste: "Alt+C",
  /** Alt + M - Ir para conteúdo principal */
  irParaMain: "Alt+M",
  /** Escape - Fechar modais/painéis */
  fechar: "Escape",
} as const;
