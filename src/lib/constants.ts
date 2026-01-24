// Constantes do Sistema - PWA Ouvidoria DF
// Baseado na análise do sistema real do Participa DF

import {
  TipoManifestacao,
  CategoriaAssunto,
  ConfiguracaoTipoManifestacao,
  ConfiguracaoCategoria,
} from "@/types/manifestacao";
import { ConfiguracaoUpload } from "@/types/anexo";

/**
 * Etapas do Wizard de Manifestação
 * Fluxo "Story-First" com IZA Inteligente (5 etapas)
 *
 * Diferencial: Usuário conta sua história primeiro,
 * depois a IZA sugere a classificação (tipo + órgão)
 */
export const ETAPAS_WIZARD = [
  { id: 1, slug: "relato", nome: "Relato", descricao: "Conte sua história" },
  { id: 2, slug: "sugestao", nome: "Classificação", descricao: "Tipo e área" },
  { id: 3, slug: "anexos", nome: "Anexos", descricao: "Documentos e mídias" },
  { id: 4, slug: "identificacao", nome: "Identificação", descricao: "Seus dados" },
  { id: 5, slug: "confirmacao", nome: "Confirmação", descricao: "Revisar e enviar" },
] as const;

export const TOTAL_ETAPAS = ETAPAS_WIZARD.length;

/**
 * Tipos de Manifestação
 * Configuração completa com permissões e descrições
 */
export const TIPOS_MANIFESTACAO: ConfiguracaoTipoManifestacao[] = [
  {
    id: "reclamacao",
    nome: "Reclamação",
    icone: "😤",
    descricao: "Insatisfação com serviço ou atendimento público",
    permiteAnonimo: true,
  },
  {
    id: "denuncia",
    nome: "Denúncia",
    icone: "🚨",
    descricao: "Relatar irregularidade ou má conduta",
    permiteAnonimo: true,
  },
  {
    id: "sugestao",
    nome: "Sugestão",
    icone: "💡",
    descricao: "Propor melhoria em serviço público",
    permiteAnonimo: false,
  },
  {
    id: "elogio",
    nome: "Elogio",
    icone: "⭐",
    descricao: "Reconhecer um bom serviço ou atendimento",
    permiteAnonimo: false,
  },
  {
    id: "solicitacao",
    nome: "Solicitação",
    icone: "📋",
    descricao: "Pedir um serviço ou providência",
    permiteAnonimo: false,
  },
  {
    id: "informacao",
    nome: "Informação",
    icone: "❓",
    descricao: "Esclarecer dúvida sobre serviço público",
    permiteAnonimo: false,
  },
];

/**
 * Categorias de Assunto
 * Áreas temáticas para classificação
 */
export const CATEGORIAS_ASSUNTO: ConfiguracaoCategoria[] = [
  { id: "saude", nome: "Saúde", icone: "🏥" },
  { id: "educacao", nome: "Educação", icone: "🎓" },
  { id: "transporte", nome: "Transporte", icone: "🚌" },
  { id: "seguranca", nome: "Segurança", icone: "🛡️" },
  { id: "obras", nome: "Obras e Infraestrutura", icone: "🏗️" },
  { id: "saneamento", nome: "Saneamento", icone: "💧" },
  { id: "meio-ambiente", nome: "Meio Ambiente", icone: "🌳" },
  { id: "documentos", nome: "Documentos", icone: "📄" },
  { id: "assistencia-social", nome: "Assistência Social", icone: "🤝" },
  { id: "outro", nome: "Outro", icone: "🏛️" },
];

/**
 * Assuntos Detalhados por Categoria
 * Extraído da base real do Participa DF
 */
export const ASSUNTOS_POR_CATEGORIA: Record<CategoriaAssunto, string[]> = {
  saude: [
    "Atendimento médico",
    "Atendimento em urgência e emergência",
    "Agendamento de Consultas",
    "Agendamento de Exames",
    "Agendamento de Cirurgias",
    "Falta de medicamento",
    "Falta de médicos",
    "Filas em unidades de saúde",
    "Vacina COVID-19",
    "Vacinas humanas",
    "Leitos de UTI",
    "Funcionamento do SAMU",
    "Infecção hospitalar",
    "Erro médico",
    "Infraestrutura em unidade de saúde pública",
    "Tempo de espera atendimento em unidade de saúde pública",
    "Resultados de exames",
  ],
  educacao: [
    "Matrícula em escola pública",
    "Falta de professor",
    "Infraestrutura escolar",
    "Merenda escolar",
    "Transporte escolar",
    "Material didático",
    "Creche e educação infantil",
    "Educação especial",
    "Educação de jovens e adultos",
    "Ensino técnico e profissionalizante",
  ],
  transporte: [
    "Ônibus - atraso ou falta",
    "Metrô - funcionamento",
    "BRT - funcionamento",
    "Condições do veículo",
    "Comportamento do motorista",
    "Passe estudantil",
    "Bilhete único",
    "Itinerário de linha",
    "Ponto de ônibus",
    "Tarifa de transporte",
  ],
  seguranca: [
    "Policiamento - presença",
    "Iluminação pública",
    "Câmeras de segurança",
    "Violência urbana",
    "Trânsito - fiscalização",
    "Corpo de Bombeiros",
    "Defesa Civil",
    "Guarda Municipal",
  ],
  obras: [
    "Pavimentação de vias",
    "Calçadas",
    "Bueiros e bocas de lobo",
    "Ponte e viaduto",
    "Praças e parques",
    "Ciclovia",
    "Sinalização de trânsito",
    "Acessibilidade em vias públicas",
  ],
  saneamento: [
    "Falta de água",
    "Vazamento de água",
    "Esgoto - entupimento",
    "Esgoto a céu aberto",
    "Qualidade da água",
    "Coleta de lixo",
    "Lixo em via pública",
    "Poda de árvores",
  ],
  "meio-ambiente": [
    "Poluição sonora",
    "Poluição do ar",
    "Poluição de córregos e lagos",
    "Queimadas",
    "Desmatamento",
    "Maus tratos a animais",
    "Fiscalização ambiental",
    "Parques e unidades de conservação",
  ],
  documentos: [
    "RG - Carteira de Identidade",
    "CPF",
    "Certidão de nascimento",
    "Certidão de casamento",
    "Carteira de trabalho",
    "Título de eleitor",
    "CNH",
    "Passaporte",
  ],
  "assistencia-social": [
    "Benefícios sociais",
    "CRAS - Atendimento",
    "CREAS - Atendimento",
    "Bolsa Família",
    "BPC - Benefício de Prestação Continuada",
    "Acolhimento institucional",
    "População em situação de rua",
    "Idoso - atendimento",
    "Pessoa com deficiência - atendimento",
  ],
  outro: [
    "Atendimento ao cidadão",
    "Servidor público - conduta",
    "Concurso público",
    "Licitação e contrato",
    "Corrupção",
    "Cobrança indevida",
    "Outros assuntos",
  ],
};

/**
 * Regiões Administrativas do DF
 * Para geolocalização de manifestações
 */
export const REGIOES_ADMINISTRATIVAS = [
  "Brasília (Plano Piloto)",
  "Gama",
  "Taguatinga",
  "Brazlândia",
  "Sobradinho",
  "Planaltina",
  "Paranoá",
  "Núcleo Bandeirante",
  "Ceilândia",
  "Guará",
  "Cruzeiro",
  "Samambaia",
  "Santa Maria",
  "São Sebastião",
  "Recanto das Emas",
  "Lago Sul",
  "Riacho Fundo",
  "Lago Norte",
  "Candangolândia",
  "Águas Claras",
  "Riacho Fundo II",
  "Sudoeste/Octogonal",
  "Varjão",
  "Park Way",
  "SCIA/Estrutural",
  "Sobradinho II",
  "Jardim Botânico",
  "Itapoã",
  "SIA",
  "Vicente Pires",
  "Fercal",
  "Sol Nascente/Pôr do Sol",
  "Arniqueira",
] as const;

/**
 * Configurações de Upload de Mídia
 * Limites e tipos aceitos
 */
export const MEDIA_CONFIG: ConfiguracaoUpload = {
  audio: {
    mimeType: "audio/webm;codecs=opus",
    maxDuration: 5 * 60 * 1000, // 5 minutos em ms
    maxSize: 10 * 1024 * 1024, // 10 MB
  },
  video: {
    mimeType: "video/webm;codecs=vp9",
    maxDuration: 2 * 60 * 1000, // 2 minutos em ms
    maxSize: 15 * 1024 * 1024, // 15 MB
    constraints: {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "environment",
      },
      audio: true,
    },
  },
  photo: {
    mimeType: "image/jpeg",
    maxSize: 5 * 1024 * 1024, // 5 MB
    quality: 0.85,
  },
  document: {
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png",
    maxSize: 10 * 1024 * 1024, // 10 MB
  },
  totalMaxSize: 25 * 1024 * 1024, // 25 MB total
};

/**
 * Formatos Aceitos por Tipo
 */
export const FORMATOS_ACEITOS = {
  imagens: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  documentos: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ],
  audio: ["audio/mpeg", "audio/wav", "audio/webm", "audio/ogg"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
};

/**
 * Validações do Sistema
 */
export const VALIDACOES = {
  relato: {
    minCaracteres: 20,
    maxCaracteres: 13000,
    // Aliases
    get minimo() {
      return this.minCaracteres;
    },
    get maximo() {
      return this.maxCaracteres;
    },
  },
  cpf: {
    pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    length: 14, // Com máscara
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  telefone: {
    pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
  },
};

/**
 * Prazo de Resposta por Tipo
 * Conforme legislação da Ouvidoria
 */
export const PRAZOS_RESPOSTA: Record<
  TipoManifestacao,
  { padrao: number; maximo: number; unidade: string }
> = {
  reclamacao: { padrao: 30, maximo: 60, unidade: "dias úteis" },
  denuncia: { padrao: 30, maximo: 60, unidade: "dias úteis" },
  sugestao: { padrao: 30, maximo: 60, unidade: "dias úteis" },
  elogio: { padrao: 30, maximo: 60, unidade: "dias úteis" },
  solicitacao: { padrao: 30, maximo: 60, unidade: "dias úteis" },
  informacao: { padrao: 20, maximo: 30, unidade: "dias úteis" },
};

/**
 * URLs e Endpoints
 * Configuração centralizada para facilitar migração para API real
 */
export const API_CONFIG = {
  // Base URL - trocar para URL real em produção
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",

  // Endpoints
  endpoints: {
    manifestacao: "/manifestacao",
    protocolo: "/protocolo",
    assuntos: "/assuntos",
    auth: "/security/is-auth",
  },

  // Headers padrão
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // Timeout em ms
  timeout: 30000,
};

/**
 * Configuração de Analytics e Tracking
 * Para integração com sistemas de monitoramento
 */
export const ANALYTICS_CONFIG = {
  // Google Analytics ID (se aplicável)
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",

  // Eventos personalizados
  events: {
    inicioManifestacao: "manifestacao_iniciada",
    etapaCompleta: "etapa_completa",
    manifestacaoEnviada: "manifestacao_enviada",
    erroEnvio: "erro_envio",
    midiaCaptured: "midia_capturada",
    offlineSaved: "salvo_offline",
  },
};
