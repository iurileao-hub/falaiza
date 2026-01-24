// Banco de Mensagens da IZA - Assistente Virtual da Ouvidoria DF
// Configuração inteligente para fácil personalização e integração futura com IA

import { TipoManifestacao } from "@/types/manifestacao";

/**
 * Variações visuais da IZA
 * Cada variação corresponde a um estado/contexto diferente
 */
export type IzaVariante = "default" | "lupa" | "sucesso" | "erro" | "pensando" | "acenando";

/**
 * Configuração de avatar da IZA
 */
export const IZA_AVATARES: Record<IzaVariante, string> = {
  default: "/assets/iza/iza-1.png",
  lupa: "/assets/iza/iza-3.png",
  sucesso: "/assets/iza/iza-1.png", // Usar default até ter variante específica
  erro: "/assets/iza/iza-1.png",
  pensando: "/assets/iza/iza-3.png",
  acenando: "/assets/iza/iza-1.png",
};

/**
 * Função auxiliar para artigo correto do tipo
 */
const artigoTipo = (tipo: TipoManifestacao): string => {
  const artigos: Record<TipoManifestacao, string> = {
    reclamacao: "uma",
    denuncia: "uma",
    sugestao: "uma",
    elogio: "um",
    solicitacao: "uma",
    informacao: "um pedido de",
  };
  return artigos[tipo] || "uma";
};

/**
 * Função auxiliar para nome formatado do tipo
 */
const nomeTipo = (tipo: TipoManifestacao): string => {
  const nomes: Record<TipoManifestacao, string> = {
    reclamacao: "reclamação",
    denuncia: "denúncia",
    sugestao: "sugestão",
    elogio: "elogio",
    solicitacao: "solicitação",
    informacao: "informação",
  };
  return nomes[tipo] || tipo;
};

/**
 * Banco de mensagens organizadas por etapa e contexto
 * Estrutura configurável para fácil expansão
 */
export const MENSAGENS_IZA = {
  /**
   * Boas-vindas e início do fluxo
   */
  boasVindas: {
    inicial: "Olá! Sou a IZA, assistente virtual da Ouvidoria do Distrito Federal. Vou te ajudar a registrar sua manifestação de forma simples e rápida. Para começar, escolha abaixo o tipo de manifestação que você deseja fazer:",
    retorno: "Que bom te ver de volta! Vamos continuar de onde paramos?",
    rascunhoRecuperado: "Encontrei um rascunho salvo. Quer continuar essa manifestação?",
  },

  /**
   * Etapa 1: Seleção de Tipo
   */
  tipo: {
    inicial: "Para começar, me diz: qual o tipo de manifestação você quer fazer?",
    ajuda: "Cada tipo tem uma finalidade diferente. Clique em um card para ver mais detalhes.",
    selecao: (tipo: TipoManifestacao) =>
      `Entendi! Você quer fazer ${artigoTipo(tipo)} ${nomeTipo(tipo)}.`,
    confirmacao: (tipo: TipoManifestacao) =>
      `Ótimo! Vou te ajudar a registrar sua ${nomeTipo(tipo)}. Vamos em frente?`,
  },

  /**
   * Etapa 2 (novo fluxo): Sugestão Inteligente
   * A IZA analisa o relato e sugere tipo e área automaticamente
   */
  sugestao: {
    analisando: "Deixa eu analisar o que você me contou...",
    confiancaAlta: (tipo: string, area: string) =>
      `Entendi! Pelo que você me contou, isso parece ser ${tipo} sobre ${area}. Está certo?`,
    confiancaMedia: (tipo: string, area: string) =>
      `Analisando seu relato, acredito que seja ${tipo} relacionado a ${area}. Confira se está correto!`,
    confiancaBaixa: (tipo: string, area: string) =>
      `Não tenho certeza, mas pode ser ${tipo} sobre ${area}. Por favor, verifique e ajuste se necessário.`,
    erro: "Ops, tive um probleminha ao analisar seu relato. Mas não se preocupe, você pode escolher manualmente!",
    editado: "Classificação ajustada por você!",
  },

  /**
   * Etapa 2 (fluxo antigo): Assunto/Categoria - mantido por compatibilidade
   */
  assunto: {
    inicial: (tipo: TipoManifestacao) =>
      `Certo! Agora me diz: sua ${nomeTipo(tipo)} é sobre qual área?`,
    busca: "Digite para buscar ou escolha uma das categorias abaixo.",
    selecao: (categoria: string) => `Ótimo, vou registrar como ${categoria}.`,
    sugestao: (assunto: string) =>
      `Baseado no seu relato, sugiro classificar como "${assunto}". Está correto?`,
    naoEncontrado:
      "Não foi possível sugerir um assunto para seu relato. Escolha um assunto a partir da pesquisa.",
  },

  /**
   * Etapa 1 (novo fluxo): Relato - Story First
   * O cidadão conta sua história primeiro, depois a IZA sugere a classificação
   */
  relato: {
    inicial:
      "Olá! Sou a IZA, assistente virtual da Ouvidoria do DF. Conta pra mim o que aconteceu! Você pode escrever, gravar áudio, tirar foto ou gravar vídeo. Use quantos formatos quiser!",
    dicaTexto: "Descreva com detalhes o que aconteceu: quando, onde e como foi.",
    dicaAudio: "💡 Dica: gravando em áudio fica mais fácil explicar os detalhes!",
    dicaFoto: "📸 Fotos e vídeos ajudam muito a entender o problema. Pode continuar se quiser!",
    minimo: "Escreva pelo menos 20 caracteres ou adicione uma mídia.",
    caracteresRestantes: (restantes: number) =>
      `Falta pouco! Mais ${restantes} caracteres para continuar.`,
  },

  /**
   * Etapa 4: Anexos
   */
  anexos: {
    inicial:
      "Quer adicionar mais algum arquivo? Documentos, fotos ou vídeos que ajudem a resolver sua demanda.",
    adicionado: (quantidade: number) =>
      quantidade === 1
        ? "Você tem 1 arquivo anexado. Quer adicionar mais algum?"
        : `Você tem ${quantidade} arquivos anexados. Quer adicionar mais?`,
    limite: (usadoMB: number, totalMB: number) =>
      `Você usou ${usadoMB.toFixed(1)} MB de ${totalMB} MB disponíveis.`,
    vazio: "Não tem problema se não quiser anexar nada. Podemos continuar!",
    sucesso: (nome: string) => `Arquivo "${nome}" adicionado com sucesso!`,
    erro: (motivo: string) => `Não foi possível adicionar o arquivo: ${motivo}`,
    limiteAtingido: "Limite de tamanho atingido. Remova algum arquivo para adicionar outro.",
  },

  /**
   * Etapa 5: Identificação
   */
  identificacao: {
    inicial:
      "Estamos quase lá! Agora preciso saber: você quer se identificar ou prefere enviar de forma anônima?",
    identificado: "Ótimo! Preenche seus dados aqui. Eles são protegidos pela LGPD.",
    anonimo:
      "Tudo bem! Lembre-se que sem identificação você não poderá acompanhar a resposta.",
    obrigatorio: (tipo: TipoManifestacao) =>
      `Para ${nomeTipo(tipo)}, a identificação é obrigatória para que possamos te responder.`,
    lgpdAviso:
      "Seus dados pessoais são protegidos pela Lei Geral de Proteção de Dados (LGPD) e serão usados apenas para responder sua manifestação.",
  },

  /**
   * Etapa 6: Confirmação
   */
  confirmacao: {
    inicial: "Vamos revisar tudo antes de enviar? Confere se está tudo certo:",
    enviando: "Aguarde, estou enviando sua manifestação...",
    sucesso: "🎉 Manifestação enviada com sucesso!",
    protocolo: (protocolo: string) =>
      `Seu número de protocolo é: ${protocolo}. Guarde esse número para acompanhar o andamento.`,
    prazo: (prazo: string) =>
      `O prazo para resposta é de ${prazo}. Você receberá notificação quando houver atualização.`,
    erro: "Ops! Algo deu errado. Mas não se preocupe, seus dados estão salvos. Tente novamente.",
    erroConexao:
      "Parece que você está sem conexão. Salvei sua manifestação e enviarei automaticamente quando você voltar online.",
  },

  /**
   * Estados de Conexão
   */
  offline: {
    aviso:
      "Você está sem conexão. Não se preocupe! Seus dados estão salvos e serão enviados quando você voltar a ficar online.",
    sincronizando: "Conectado! Sincronizando seus dados...",
    sincronizado: "Tudo sincronizado! Seus dados estão seguros.",
  },

  /**
   * Ajuda e Suporte
   */
  ajuda: {
    central162:
      "Se você não conseguir fazer o registro aqui, ligue na Central 162. O atendimento é 24 horas.",
    duvidas: "Tem dúvidas? Clique no botão de ajuda ou consulte as Perguntas Frequentes.",
    acessibilidade:
      "Este site possui recursos de acessibilidade. Pressione Alt+A para abrir o painel de opções.",
  },

  /**
   * Validações e Erros
   */
  validacao: {
    campoObrigatorio: "Este campo é obrigatório.",
    cpfInvalido: "CPF inválido. Verifique os números digitados.",
    emailInvalido: "E-mail inválido. Verifique o formato.",
    telefoneInvalido: "Telefone inválido. Use o formato (XX) XXXXX-XXXX.",
    arquivoGrande: (maxMB: number) =>
      `Arquivo muito grande. O tamanho máximo é ${maxMB} MB.`,
    tipoNaoPermitido: "Tipo de arquivo não permitido.",
  },
};

/**
 * Função para obter mensagem da IZA com fallback
 * Útil para integração futura com IA generativa
 */
export function getMensagemIza(
  caminho: string,
  parametros?: Record<string, unknown>
): string {
  const partes = caminho.split(".");
  let mensagem: unknown = MENSAGENS_IZA;

  for (const parte of partes) {
    if (mensagem && typeof mensagem === "object" && mensagem !== null && parte in mensagem) {
      mensagem = (mensagem as Record<string, unknown>)[parte];
    } else {
      return "Estou aqui para te ajudar!"; // Fallback
    }
  }

  if (typeof mensagem === "function" && parametros) {
    const primeiroParam = Object.values(parametros)[0];
    return (mensagem as (param: unknown) => string)(primeiroParam);
  }

  return typeof mensagem === "string" ? mensagem : "Estou aqui para te ajudar!";
}

/**
 * Configuração para integração futura com IA
 * Estrutura preparada para substituição por modelo de linguagem
 */
export const IZA_CONFIG = {
  // Nome da assistente
  nome: "IZA",

  // Descrição para contexto de IA
  descricao:
    "Assistente virtual da Ouvidoria do Distrito Federal, amigável e acolhedora",

  // Tom de voz
  tom: {
    formalidade: "informal-respeitoso",
    empatia: "alta",
    clareza: "máxima",
  },

  // Instruções para personalização de IA
  instrucoes: {
    tratamento: "Use linguagem simples e acessível. Trate o cidadão com respeito.",
    empatia: "Demonstre compreensão com a situação do cidadão.",
    objetividade: "Seja claro e direto nas orientações.",
    acessibilidade:
      "Evite jargões técnicos. Use frases curtas quando possível.",
  },

  // Placeholder para API key de IA (não incluir valor real no código)
  aiApiKeyEnvVar: "IZA_AI_API_KEY",

  // Flag para ativar respostas de IA
  useAiResponses: process.env.NEXT_PUBLIC_IZA_USE_AI === "true",
};
