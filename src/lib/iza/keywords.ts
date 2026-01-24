/**
 * Mapeamento de palavras-chave para classificação de manifestações
 * Camada 1: Sistema de Regras
 */

import type {
  RegrasTipo,
  RegrasOrgao,
  ExtratoresEntidades,
  TipoManifestacaoId,
  OrgaoId
} from './types';

// ============================================================================
// Regras de Classificação por Tipo de Manifestação
// ============================================================================

export const REGRAS_TIPO: RegrasTipo = {
  reclamacao: {
    peso: 1.2, // Peso maior para reclamações (mais comum)
    palavras: [
      'reclamação', 'reclamar', 'reclamo',
      'péssimo', 'horrível', 'terrível', 'ruim',
      'demora', 'demorado', 'lento', 'atrasado', 'atraso',
      'não funciona', 'quebrado', 'estragado',
      'falta', 'faltando', 'falta de',
      'descaso', 'negligência', 'abandono',
      'absurdo', 'inadmissível', 'inaceitável',
      'problema', 'problemas',
      'insatisfeito', 'insatisfação', 'descontente',
      'precariedade', 'precário',
      // Palavras adicionais para melhor detecção
      'indignação', 'indignado', 'revolta', 'revoltado',
      'advertência', 'advertências', 'punição',
      'lotado', 'superlotado', 'lotação',
      'mal educado', 'mal-educado', 'grosseiro', 'grosseria',
      'prejudicado', 'prejudica', 'afeta', 'afetando',
      'não parou', 'não para', 'passou direto',
      'velho', 'velhos', 'sucateado',
      'ar-condicionado', 'ar condicionado',
      'frequência', 'frequencia',
    ],
    frases: [
      'esperei muito', 'espera muito longa',
      'não resolveram', 'não foi resolvido',
      'ninguém atende', 'não consegui atendimento',
      'fui mal atendido', 'atendimento ruim',
      'não funciona corretamente',
      'está abandonado', 'está precário',
      'falta de manutenção',
      // Frases adicionais
      'registrar minha indignação',
      'não recebo um serviço',
      'afeta minha vida',
      'cheguei atrasado',
      'abaixo do necessário',
      'extremamente mal',
      'se repete',
      'situação se repete',
      'todos os dias',
      'simplesmente não',
    ],
  },

  denuncia: {
    peso: 1.2, // Peso maior por ser mais específico
    palavras: [
      'denúncia', 'denunciar', 'denuncio',
      'corrupção', 'corrupto',
      'irregularidade', 'irregular',
      'desvio', 'desviando',
      'fraude', 'fraudulento',
      'ilegal', 'ilegalidade',
      'propina', 'suborno',
      'assédio', 'assediando',
      'abuso', 'abusivo',
      'crime', 'criminoso',
      'nepotismo', 'favorecimento',
      'superfaturamento',
      'fantasma', 'funcionário fantasma',
    ],
    frases: [
      'vi funcionário', 'presenciei irregularidade',
      'tenho provas', 'posso provar',
      'está desviando', 'está roubando',
      'pediu dinheiro', 'exigiu pagamento',
      'obra fantasma', 'contrato irregular',
      'uso indevido', 'uso particular',
      'fora do expediente',
    ],
  },

  elogio: {
    peso: 1.0,
    palavras: [
      'elogio', 'elogiar', 'elogiado',
      'parabéns', 'parabenizar',
      'excelente', 'ótimo', 'maravilhoso',
      'agradecer', 'agradecimento', 'gratidão',
      'eficiente', 'eficiência',
      'rápido', 'ágil', 'agilidade',
      'competente', 'competência',
      'educado', 'cordial', 'atencioso',
      'profissional', 'profissionalismo',
      'dedicado', 'dedicação',
    ],
    frases: [
      'muito bem atendido', 'bem atendido',
      'resolveram rápido', 'resolveu meu problema',
      'funcionário exemplar', 'servidor exemplar',
      'atendimento nota 10', 'atendimento excelente',
      'quero agradecer', 'gostaria de agradecer',
      'fez além do esperado',
      'surpreendeu positivamente',
    ],
  },

  sugestao: {
    peso: 0.9, // Peso menor para evitar falsos positivos
    palavras: [
      'sugestão', 'sugerir', 'sugiro',
      'proposta', 'propor',
      'ideia', 'ideias',
      'melhoria', 'melhorias', // Removido 'melhorar' isolado
      'implementar', 'implementação',
      'criar', 'criação',
      'inovar', 'inovação',
    ],
    frases: [
      'sugiro que', 'gostaria de sugerir',
      'minha sugestão', 'tenho uma sugestão',
      'seria interessante', 'seria bom se',
      'por que não', 'que tal',
      'uma ideia seria',
      'poderia ser criado',
      'seria legal se',
    ],
  },

  solicitacao: {
    peso: 0.9, // Peso menor para evitar conflitos com reclamação
    palavras: [
      'solicitação', // Removido 'solicito' isolado
      'requerer', 'requerimento', 'requeiro',
      'pedido', // Removido 'pedir' isolado
      'necessidade',
      'instalar', 'instalação',
      'consertar', 'conserto', 'reparo',
      'agendar', 'agendamento',
      'emitir', 'emissão',
    ],
    frases: [
      'gostaria de solicitar',
      'venho solicitar a instalação',
      'venho solicitar o conserto',
      'venho solicitar a emissão',
      'preciso de um agendamento',
      'necessito de atendimento',
      'peço a instalação',
      'peço o conserto',
    ],
  },

  informacao: {
    peso: 0.9, // Peso menor pois é mais genérico
    palavras: [
      'informação', 'informações',
      'dúvida', 'dúvidas',
      'pergunta', 'perguntar',
      'saber', 'conhecer',
      'como funciona', 'como faço',
      'onde', 'quando', 'qual',
      'esclarecer', 'esclarecimento',
      'orientação', 'orientar',
    ],
    frases: [
      'gostaria de saber', 'quero saber',
      'tenho uma dúvida', 'minha dúvida',
      'como faço para', 'como posso',
      'onde posso', 'onde devo',
      'qual o procedimento',
      'poderia me informar',
      'preciso de informação',
    ],
  },
};

// ============================================================================
// Regras de Classificação por Órgão/Área
// ============================================================================

export const REGRAS_ORGAO: RegrasOrgao = {
  saude: {
    palavras: [
      'hospital', 'hospitais',
      'upa', 'pronto-socorro', 'emergência',
      'posto de saúde', 'unidade de saúde', 'ubs',
      'médico', 'médica', 'médicos',
      'enfermeiro', 'enfermeira', 'enfermagem',
      'remédio', 'medicamento', 'medicamentos',
      'vacina', 'vacinação', 'vacinas',
      'exame', 'exames',
      'cirurgia', 'operação',
      'consulta', 'consultas',
      'leito', 'leitos', 'internação',
      'ambulância', 'samu',
      'dentista', 'odontologia',
      'saúde mental', 'caps', 'psiquiatra',
    ],
    entidades: [
      'HRT', 'HRG', 'HRAN', 'HRAS', 'HRS', 'HRC', 'HRP', 'HRBz', 'HRPa', 'HRSM',
      'Hospital Regional de Taguatinga',
      'Hospital Regional do Gama',
      'Hospital Regional da Asa Norte',
      'Hospital Regional da Asa Sul',
      'Hospital de Base',
      'UPA', 'UBS',
      'SAMU', 'SES', 'Secretaria de Saúde',
    ],
  },

  educacao: {
    palavras: [
      'escola', 'escolas',
      'professor', 'professora', 'professores',
      'aluno', 'aluna', 'alunos', 'estudante',
      'matrícula', 'matrículas',
      'creche', 'creches',
      'merenda', 'alimentação escolar',
      'uniforme', 'uniformes',
      'transporte escolar',
      'ensino', 'educação',
      'aula', 'aulas',
      'diretor', 'diretora', 'direção',
      'secretaria escolar',
    ],
    entidades: [
      'CEF', 'CED', 'EC', 'CEI', 'CEM',
      'Centro de Ensino',
      'Escola Classe',
      'SEEDF', 'Secretaria de Educação',
      'Regional de Ensino',
    ],
  },

  transporte: {
    palavras: [
      'ônibus', 'ônibus',
      'metrô', 'metro',
      'brt',
      'passagem', 'tarifa',
      'motorista',
      'ponto de ônibus', 'parada',
      'linha', 'linhas', 'itinerário',
      'horário', 'horários',
      'lotado', 'lotação', 'superlotado',
      'transporte público', 'transporte coletivo',
      'bilhete único', 'cartão',
      'terminal', 'rodoviária',
    ],
    entidades: [
      'DFTrans',
      'BRB Mobilidade',
      'Piracicabana',
      'Urbi',
      'Metrô-DF',
      'Rodoviária do Plano Piloto',
      'Semob', 'Secretaria de Mobilidade',
    ],
  },

  seguranca: {
    palavras: [
      'polícia', 'policial', 'policiais',
      'delegacia',
      'segurança', 'segurança pública',
      'crime', 'crimes', 'criminoso',
      'roubo', 'assalto', 'furto',
      'violência', 'violento',
      'iluminação', 'escuro',
      'bombeiro', 'bombeiros',
      'ocorrência', 'boletim',
      'patrulha', 'viatura',
    ],
    entidades: [
      'PMDF', 'Polícia Militar',
      'PCDF', 'Polícia Civil',
      'CBMDF', 'Corpo de Bombeiros',
      'SSP', 'Secretaria de Segurança',
      'Delegacia',
    ],
  },

  obras: {
    palavras: [
      'obra', 'obras',
      'construção', 'construir',
      'reforma', 'reformar',
      'asfalto', 'pavimentação',
      'buraco', 'buracos', 'cratera',
      'calçada', 'calçadas',
      'rua', 'avenida', 'via',
      'ponte', 'viaduto', 'passarela',
      'praça', 'parque',
      'manutenção', 'conservação',
    ],
    entidades: [
      'NOVACAP',
      'DER', 'Departamento de Estradas',
      'Administração Regional',
      'SO', 'Secretaria de Obras',
    ],
  },

  saneamento: {
    palavras: [
      'água', 'falta de água',
      'esgoto', 'esgotamento',
      'bueiro', 'bueiros',
      'enchente', 'alagamento', 'inundação',
      'vazamento', 'vazando',
      'cano', 'tubulação',
      'torneira', 'hidrômetro',
      'conta de água',
      'tratamento', 'saneamento básico',
    ],
    entidades: [
      'CAESB',
      'Companhia de Saneamento',
    ],
  },

  'meio-ambiente': {
    palavras: [
      'meio ambiente', 'ambiental',
      'árvore', 'árvores', 'vegetação',
      'poda', 'podar', 'corte',
      'lixo', 'lixeira', 'coleta',
      'reciclagem', 'reciclável',
      'poluição', 'poluir',
      'queimada', 'fogo', 'incêndio',
      'animal', 'animais', 'fauna',
      'desmatamento', 'desmate',
      'nascente', 'córrego', 'rio',
    ],
    entidades: [
      'IBRAM', 'Instituto Brasília Ambiental',
      'SLU', 'Serviço de Limpeza Urbana',
      'SEMA', 'Secretaria de Meio Ambiente',
    ],
  },

  documentos: {
    palavras: [
      'documento', 'documentos', 'documentação',
      'identidade', 'rg', 'cpf',
      'carteira', 'certidão',
      'nascimento', 'casamento', 'óbito',
      'segunda via',
      'na hora', 'na-hora',
      'atendimento', 'agendamento',
      'taxa', 'emolumentos',
    ],
    entidades: [
      'Na Hora',
      'DETRAN', 'Departamento de Trânsito',
      'Cartório',
      'Receita Federal',
    ],
  },

  'assistencia-social': {
    palavras: [
      'assistência social', 'social',
      'cras', 'creas',
      'benefício', 'benefícios',
      'bolsa', 'auxílio',
      'família', 'famílias',
      'vulnerável', 'vulnerabilidade',
      'criança', 'adolescente', 'idoso',
      'moradia', 'habitação',
      'renda', 'cadastro único', 'cadunico',
    ],
    entidades: [
      'CRAS', 'CREAS',
      'SEDEST', 'Secretaria de Desenvolvimento Social',
      'Conselho Tutelar',
    ],
  },

  outro: {
    palavras: [],
    entidades: [
      'GDF', 'Governo do Distrito Federal',
      'Administração',
    ],
  },
};

// ============================================================================
// Extratores de Entidades (Regex)
// ============================================================================

/**
 * Regiões Administrativas do Distrito Federal
 */
const REGIOES_ADMINISTRATIVAS = [
  'Plano Piloto', 'Asa Norte', 'Asa Sul',
  'Gama',
  'Taguatinga',
  'Brazlândia',
  'Sobradinho', 'Sobradinho II',
  'Planaltina',
  'Paranoá',
  'Núcleo Bandeirante',
  'Ceilândia',
  'Guará', 'Guará I', 'Guará II',
  'Cruzeiro', 'Cruzeiro Novo', 'Cruzeiro Velho',
  'Samambaia', 'Samambaia Norte', 'Samambaia Sul',
  'Santa Maria',
  'São Sebastião',
  'Recanto das Emas',
  'Lago Sul',
  'Lago Norte',
  'Riacho Fundo', 'Riacho Fundo I', 'Riacho Fundo II',
  'Candangolândia',
  'Águas Claras',
  'Vicente Pires',
  'Park Way',
  'SCIA', 'Estrutural', 'Cidade Estrutural',
  'Sudoeste', 'Octogonal', 'Sudoeste/Octogonal',
  'Jardim Botânico',
  'Itapoã',
  'SIA',
  'Varjão',
  'Fercal',
  'Sol Nascente', 'Pôr do Sol', 'Sol Nascente/Pôr do Sol',
  'Arniqueira',
];

export const EXTRATORES: ExtratoresEntidades = {
  /**
   * Extrai locais (Regiões Administrativas do DF)
   */
  locais: new RegExp(
    `\\b(${REGIOES_ADMINISTRATIVAS.join('|')})\\b`,
    'gi'
  ),

  /**
   * Extrai datas em diversos formatos
   */
  datas: new RegExp(
    [
      // Formato DD/MM/AAAA ou DD-MM-AAAA
      '\\d{1,2}[/\\-]\\d{1,2}[/\\-]\\d{2,4}',
      // Formato "15 de janeiro de 2026"
      '\\d{1,2}\\s+de\\s+(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\\s+de\\s+\\d{4})?',
      // Termos relativos
      'ontem', 'hoje', 'anteontem',
      'semana passada', 'mês passado', 'ano passado',
      'essa semana', 'este mês',
      'há \\d+ dias?', 'há \\d+ semanas?', 'há \\d+ meses?',
    ].join('|'),
    'gi'
  ),

  /**
   * Extrai órgãos específicos mencionados
   */
  orgaos: new RegExp(
    [
      // Hospitais
      'Hospital Regional de \\w+',
      'Hospital de Base',
      'UPA [\\w\\s]+',
      'UBS [\\w\\s]+',
      // Escolas
      'Escola Classe \\w+',
      'Centro de Ensino \\w+',
      'CEF \\w+', 'CED \\w+', 'EC \\w+',
      // Órgãos
      'DETRAN', 'CAESB', 'CEB', 'NOVACAP', 'DER',
      'Delegacia [\\w\\s]+',
      'Na Hora [\\w\\s]*',
      'Administração Regional [\\w\\s]+',
      // Siglas
      'PMDF', 'PCDF', 'CBMDF',
      'IBRAM', 'SLU', 'SAMU',
    ].join('|'),
    'gi'
  ),
};

// ============================================================================
// Metadados de Tipos e Órgãos
// ============================================================================

export interface TipoManifestacaoMeta {
  id: TipoManifestacaoId;
  nome: string;
  descricao: string;
  permiteAnonimo: boolean;
}

export const TIPOS_MANIFESTACAO: TipoManifestacaoMeta[] = [
  {
    id: 'reclamacao',
    nome: 'Reclamação',
    descricao: 'Algo não está funcionando bem',
    permiteAnonimo: true,
  },
  {
    id: 'denuncia',
    nome: 'Denúncia',
    descricao: 'Irregularidade ou má conduta',
    permiteAnonimo: true,
  },
  {
    id: 'sugestao',
    nome: 'Sugestão',
    descricao: 'Ideia para melhorar',
    permiteAnonimo: false,
  },
  {
    id: 'elogio',
    nome: 'Elogio',
    descricao: 'Reconhecer um bom serviço',
    permiteAnonimo: false,
  },
  {
    id: 'solicitacao',
    nome: 'Solicitação',
    descricao: 'Pedir um serviço',
    permiteAnonimo: false,
  },
  {
    id: 'informacao',
    nome: 'Informação',
    descricao: 'Tirar uma dúvida',
    permiteAnonimo: false,
  },
];

export interface OrgaoMeta {
  id: OrgaoId;
  nome: string;
  icone: string;
}

export const ORGAOS: OrgaoMeta[] = [
  { id: 'saude', nome: 'Saúde', icone: '🏥' },
  { id: 'educacao', nome: 'Educação', icone: '🎓' },
  { id: 'transporte', nome: 'Transporte', icone: '🚌' },
  { id: 'seguranca', nome: 'Segurança', icone: '🛡️' },
  { id: 'obras', nome: 'Obras e Infraestrutura', icone: '🏗️' },
  { id: 'saneamento', nome: 'Saneamento', icone: '💧' },
  { id: 'meio-ambiente', nome: 'Meio Ambiente', icone: '🌳' },
  { id: 'documentos', nome: 'Documentos', icone: '📄' },
  { id: 'assistencia-social', nome: 'Assistência Social', icone: '🤝' },
  { id: 'outro', nome: 'Outro', icone: '🏛️' },
];

// ============================================================================
// Funções Auxiliares
// ============================================================================

/**
 * Retorna o artigo correto para o tipo de manifestação
 */
export function artigoTipo(tipo: TipoManifestacaoId): string {
  const artigos: Record<TipoManifestacaoId, string> = {
    reclamacao: 'uma',
    denuncia: 'uma',
    sugestao: 'uma',
    elogio: 'um',
    solicitacao: 'uma',
    informacao: 'um pedido de',
  };
  return artigos[tipo] || 'uma';
}

/**
 * Obtém os metadados de um tipo pelo ID
 */
export function getTipoMeta(id: TipoManifestacaoId): TipoManifestacaoMeta | undefined {
  return TIPOS_MANIFESTACAO.find(t => t.id === id);
}

/**
 * Obtém os metadados de um órgão pelo ID
 */
export function getOrgaoMeta(id: OrgaoId): OrgaoMeta | undefined {
  return ORGAOS.find(o => o.id === id);
}
