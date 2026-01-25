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
      // === Palavras diretas ===
      'reclamação', 'reclamar', 'reclamo', 'reclamando',

      // === Adjetivos negativos (qualidade do serviço) ===
      'péssimo', 'pessimo', 'horrível', 'horrivel', 'terrível', 'terrivel',
      'ruim', 'horroroso', 'lamentável', 'lamentavel', 'deplorável', 'deploravel',
      'ridículo', 'ridiculo', 'vergonhoso', 'lastimável', 'lastimavel',
      'desastroso', 'catastrófico', 'catastrofico', 'pífio', 'pifio',

      // === Tempo/Demora ===
      'demora', 'demorado', 'lento', 'atrasado', 'atraso', 'lentidão', 'lentidao',
      'morosidade', 'moroso', 'eternidade', 'espera', 'esperando',
      'horas', 'meses', 'semanas', 'dias', // contexto de espera

      // === Estado de funcionamento ===
      'não funciona', 'nao funciona', 'quebrado', 'estragado', 'danificado',
      'defeito', 'defeituoso', 'pane', 'pifou', 'parou', 'travou',
      'inoperante', 'fora do ar', 'sem funcionar', 'não liga', 'nao liga',

      // === Falta/Ausência ===
      'falta', 'faltando', 'falta de', 'sem', 'ausência', 'ausencia',
      'carência', 'carencia', 'escassez', 'inexistente', 'nunca tem',

      // === Descaso/Negligência ===
      'descaso', 'negligência', 'negligencia', 'abandono', 'abandonado',
      'desleixo', 'desídia', 'desidia', 'omissão', 'omissao', 'omisso',
      'largado', 'jogado', 'esquecido', 'ignorado',

      // === Expressões de indignação (muito comum em reclamações) ===
      'absurdo', 'inadmissível', 'inadmissivel', 'inaceitável', 'inaceitavel',
      'revoltante', 'indecente', 'vergonha', 'palhaçada', 'palhacada',
      'sacanagem', 'safadeza', 'falta de respeito', 'desrespeito',
      'pouca vergonha', 'sem vergonha', 'cara de pau',

      // === Problemas gerais ===
      'problema', 'problemas', 'dificuldade', 'transtorno', 'transtornos',
      'empecilho', 'obstáculo', 'obstaculo', 'entrave', 'complicação', 'complicacao',

      // === Estado emocional do cidadão ===
      'insatisfeito', 'insatisfação', 'insatisfacao', 'descontente',
      'indignação', 'indignacao', 'indignado', 'revolta', 'revoltado',
      'irritado', 'furioso', 'nervoso', 'estressado', 'cansado',
      'frustrado', 'frustração', 'frustracao', 'decepcionado', 'decepção', 'decepcao',

      // === Precariedade ===
      'precariedade', 'precário', 'precario', 'sucateado', 'sucateamento',
      'deteriorado', 'deterioração', 'deterioracao', 'caindo aos pedaços',

      // === Atendimento ruim ===
      'mal educado', 'mal-educado', 'grosseiro', 'grosseria', 'rude',
      'indelicado', 'antipático', 'antipatico', 'desrespeitoso',
      'arrogante', 'prepotente', 'ignorante', 'estúpido', 'estupido',

      // === Prejuízo/Impacto ===
      'prejudicado', 'prejudica', 'afeta', 'afetando', 'impacta',
      'prejuízo', 'prejuizo', 'perda', 'dano', 'lesado',

      // === Transporte (muito comum no DF) ===
      'não parou', 'nao parou', 'não para', 'nao para', 'passou direto',
      'lotado', 'superlotado', 'lotação', 'lotacao', 'cheio', 'apertado',
      'velho', 'velhos', 'caindo aos pedaços', 'cai aos pedacos',
      'ar-condicionado', 'ar condicionado', 'calor', 'abafado', 'quente',
      'frequência', 'frequencia', 'irregular', 'irregularidade',

      // === Saúde (muito comum) ===
      'fila', 'filas', 'espera', 'aguardando', 'esperando',
      'sem médico', 'sem medico', 'sem remédio', 'sem remedio',
      'atendimento demorado', 'não consegui consulta', 'nao consegui consulta',

      // === Gírias e expressões coloquiais brasileiras ===
      'uma porcaria', 'uma droga', 'não presta', 'nao presta',
      'não vale nada', 'nao vale nada', 'lixo', 'um lixo',
      'de mal a pior', 'cada vez pior', 'vai de mal a pior',
      'uma vergonha', 'que vergonha', 'dá vergonha', 'da vergonha',
      'não dá pra aguentar', 'nao da pra aguentar', 'não aguento mais', 'nao aguento mais',
      'tô de saco cheio', 'to de saco cheio', 'saco cheio',
      'não tem condição', 'nao tem condicao', 'sem condição', 'sem condicao',
      'tá osso', 'ta osso', 'tá difícil', 'ta dificil',
      'enrolação', 'enrolacao', 'enrolando', 'embromação', 'embromacao',
      'burocracia', 'burocrático', 'burocratico',

      // === Expressões de tempo de espera ===
      'horas na fila', 'dias esperando', 'meses esperando',
      'desde', 'há muito tempo', 'a muito tempo', 'faz tempo',
      'já faz', 'ja faz', 'ainda não', 'ainda nao',

      // === Sem resposta/retorno ===
      'sem resposta', 'sem retorno', 'não respondem', 'nao respondem',
      'não retornam', 'nao retornam', 'ignoram', 'fazem de conta',

      // === Infraestrutura (DF específico) ===
      'buraco', 'buracos', 'cratera', 'crateras',
      'poeira', 'lama', 'barro', 'mato alto', 'capim',
      'sem iluminação', 'sem iluminacao', 'escuro', 'apagado',
      'sem sinalização', 'sem sinalizacao',
    ],
    frases: [
      // === FRASES DE ABERTURA FORTES (indicam claramente reclamação) ===
      'venho reclamar', 'quero reclamar', 'gostaria de reclamar',
      'faço uma reclamação', 'faco uma reclamacao', 'registro uma reclamação', 'registro uma reclamacao',
      'minha reclamação', 'minha reclamacao', 'fazer uma reclamação', 'fazer uma reclamacao',
      'isso é um absurdo', 'isso e um absurdo', 'é um absurdo', 'e um absurdo',
      'é inaceitável', 'e inaceitavel', 'inaceitável que', 'inaceitavel que',
      'não é possível', 'nao e possivel', 'como é possível', 'como e possivel',

      // === Espera/Demora ===
      'esperei muito', 'espera muito longa', 'esperei horas',
      'esperando há meses', 'esperando a meses', 'espero há semanas',
      'demora absurda', 'demora inaceitável', 'demora inaceitavel',
      'nunca é atendido', 'nunca e atendido',

      // === Não resolução ===
      'não resolveram', 'nao resolveram', 'não foi resolvido', 'nao foi resolvido',
      'continua sem solução', 'continua sem solucao', 'problema persiste',
      'nada foi feito', 'ninguém resolve', 'ninguem resolve',
      'até hoje nada', 'ate hoje nada', 'até agora nada', 'ate agora nada',

      // === Atendimento ===
      'ninguém atende', 'ninguem atende', 'não consegui atendimento', 'nao consegui atendimento',
      'fui mal atendido', 'fui mal atendida', 'atendimento ruim',
      'atendimento péssimo', 'atendimento pessimo', 'atendimento horrível', 'atendimento horrivel',
      'tratamento desumano', 'fui destratado', 'fui destratada',
      'me trataram mal', 'foram grossos', 'foram rudes',

      // === Funcionamento ===
      'não funciona corretamente', 'nao funciona corretamente',
      'não funciona direito', 'nao funciona direito',
      'está abandonado', 'esta abandonado', 'está precário', 'esta precario',
      'falta de manutenção', 'falta de manutencao', 'sem manutenção', 'sem manutencao',

      // === Indignação ===
      'registrar minha indignação', 'registrar minha indignacao',
      'manifestar minha insatisfação', 'manifestar minha insatisfacao',
      'expressar minha revolta', 'demonstrar minha decepção', 'demonstrar minha decepcao',

      // === Impacto na vida ===
      'afeta minha vida', 'prejudica minha rotina', 'atrapalha meu dia',
      'cheguei atrasado', 'cheguei atrasada', 'perdi compromisso',
      'perdi consulta', 'perdi emprego',

      // === Qualidade abaixo do esperado ===
      'abaixo do necessário', 'abaixo do necessario',
      'extremamente mal', 'muito mal', 'péssimas condições', 'pessimas condicoes',
      'condições precárias', 'condicoes precarias', 'estado deplorável', 'estado deploravel',

      // === Recorrência ===
      'se repete', 'situação se repete', 'situacao se repete',
      'todos os dias', 'todo dia', 'toda vez', 'sempre assim',
      'não é a primeira vez', 'nao e a primeira vez', 'já aconteceu antes', 'ja aconteceu antes',
      'recorrente', 'frequentemente', 'constantemente',

      // === Expressões coloquiais ===
      'simplesmente não', 'simplesmente nao',
      'não tem cabimento', 'nao tem cabimento', 'não tem noção', 'nao tem nocao',
      'falta de vergonha', 'falta de respeito',
      'descaso total', 'abandono total', 'caos total',
      'uma bagunça', 'uma bagunca', 'uma zona', 'uma vergonha',
      'isso é inadmissível', 'isso e inadmissivel',
      'isso não pode continuar', 'isso nao pode continuar',

      // === Transporte (DF) ===
      'ônibus não veio', 'onibus nao veio', 'ônibus atrasado', 'onibus atrasado',
      'metrô lotado', 'metro lotado', 'metrô parado', 'metro parado',
      'ponto sem cobertura', 'parada sem abrigo',
      'passagem cara', 'tarifa abusiva',

      // === Saúde (DF) ===
      'sem médico', 'sem medico', 'falta médico', 'falta medico',
      'falta remédio', 'falta remedio', 'sem medicamento',
      'upa lotada', 'hospital lotado', 'emergência cheia', 'emergencia cheia',
      'consulta desmarcada', 'exame cancelado', 'cirurgia adiada',

      // === Educação (DF) ===
      'escola sem professor', 'falta professor', 'sem merenda',
      'banheiro quebrado', 'ventilador quebrado', 'sem ventilação', 'sem ventilacao',

      // === Infraestrutura (DF) ===
      'rua esburacada', 'calçada quebrada', 'calcada quebrada',
      'poste apagado', 'sem luz', 'falta luz', 'queda de energia',
      'falta água', 'falta agua', 'sem água', 'sem agua',
      'esgoto vazando', 'bueiro entupido', 'enchente', 'alagamento',

      // === Reclamação passiva / frustração prolongada ===
      'há mais de', 'a mais de', 'faz mais de',
      'há meses', 'a meses', 'faz meses',
      'cheiro insuportável', 'cheiro insuportavel', 'cheiro é insuportável', 'cheiro e insuportavel',
      'ninguém aparece', 'ninguem aparece', 'ninguém veio', 'ninguem veio',
      'já liguei', 'ja liguei', 'já chamei', 'ja chamei',
      'várias vezes', 'varias vezes', 'diversas vezes',
      'não resolve', 'nao resolve', 'não resolvem', 'nao resolvem',
    ],
  },

  denuncia: {
    peso: 1.2, // Peso maior por ser mais específico
    palavras: [
      // === Palavras diretas ===
      'denúncia', 'denuncia', 'denunciar', 'denuncio', 'denunciando',
      'reportar', 'delatar', 'delação', 'delacao',

      // === Corrupção ===
      'corrupção', 'corrupcao', 'corrupto', 'corruptos',
      'propina', 'suborno', 'subornar', 'pagamento indevido',
      'dinheiro por fora', 'caixa dois', 'caixa 2',
      'desvio', 'desviando', 'desviou', 'desvio de dinheiro', 'desvio de verba',
      'peculato', 'enriquecimento ilícito', 'enriquecimento ilicito',
      'lavagem de dinheiro', 'lavagem',

      // === Fraude ===
      'fraude', 'fraudulento', 'fraudar', 'fraudando',
      'falsificação', 'falsificacao', 'falsificado', 'falsificar',
      'adulteração', 'adulteracao', 'adulterado',
      'documento falso', 'assinatura falsa', 'nota fria',
      'superfaturamento', 'superfaturado', 'sobrepreço', 'sobrepreco',

      // === Irregularidades ===
      'irregularidade', 'irregular', 'irregularidades',
      'ilegal', 'ilegalidade', 'ilícito', 'ilicito',
      'clandestino', 'clandestina', 'sem autorização', 'sem autorizacao',
      'sem licença', 'sem licenca', 'sem alvará', 'sem alvara',

      // === Nepotismo e favorecimento ===
      'nepotismo', 'favorecimento', 'favorecido', 'favoritismo',
      'cabide de emprego', 'indicação política', 'indicacao politica',
      'parente', 'familiar', 'apadrinhado', 'afilhado político', 'afilhado politico',
      'amigo do rei', 'panelinha', 'corporativismo',

      // === Funcionário fantasma ===
      'fantasma', 'funcionário fantasma', 'funcionario fantasma',
      'servidor fantasma', 'não trabalha', 'nao trabalha',
      'ausente', 'faltoso', 'abandono de cargo',
      'recebe sem trabalhar', 'ganha sem fazer nada',

      // === Assédio ===
      'assédio', 'assedio', 'assediando', 'assediador',
      'assédio moral', 'assedio moral', 'assédio sexual', 'assedio sexual',
      'perseguição', 'perseguicao', 'perseguido', 'perseguindo',
      'humilhação', 'humilhacao', 'humilhado', 'humilhando',
      'intimidação', 'intimidacao', 'intimidado', 'intimidando',

      // === Abuso de poder ===
      'abuso', 'abusivo', 'abuso de poder', 'abuso de autoridade',
      'autoritarismo', 'autoritário', 'autoritario',
      'truculência', 'truculencia', 'truculento',
      'arbitrariedade', 'arbitrário', 'arbitrario',

      // === Crime/Criminoso ===
      'crime', 'criminoso', 'criminosa', 'crimes',
      'delito', 'infração', 'infracao',
      'roubo', 'roubando', 'roubou', 'roubaram',
      'furto', 'furtando', 'furtou', 'furtaram',
      'extorsão', 'extorsao', 'extorquir', 'extorquindo',

      // === Mau uso de recursos públicos ===
      'uso indevido', 'uso particular', 'uso pessoal',
      'desvio de função', 'desvio de finalidade',
      'recurso público', 'recurso publico', 'dinheiro público', 'dinheiro publico',
      'patrimônio público', 'patrimonio publico', 'bem público', 'bem publico',
      'veículo oficial', 'veiculo oficial', 'carro oficial',

      // === Improbidade ===
      'improbidade', 'improbidade administrativa',
      'má fé', 'ma fe', 'má-fé', 'ma-fe', 'dolo', 'doloso',
      'conduta imprópria', 'conduta impropria', 'má conduta', 'ma conduta',

      // === Gírias e coloquialismos ===
      'roubalheira', 'malandragem', 'mamata', 'trem da alegria',
      'rolo', 'esquema', 'falcatrua', 'tramóia', 'tramoia',
      'jeitinho', 'jeitinho brasileiro', 'dar um jeito',
      'molhar a mão', 'por baixo dos panos', 'por baixo do pano',
      'coisa errada', 'coisa feia', 'coisa suja',
      'maracutaia', 'pilantragem', 'vigarice',
      'tá errado', 'ta errado', 'está errado', 'esta errado',

      // === Provas/Evidências ===
      'prova', 'provas', 'evidência', 'evidencia',
      'foto', 'fotos', 'vídeo', 'video', 'gravação', 'gravacao',
      'documento', 'documentos', 'comprovante', 'comprovantes',
      'testemunha', 'testemunhas', 'flagrante',

      // === Termos legais ===
      'prevaricação', 'prevaricacao', 'omissão', 'omissao',
      'concussão', 'concussao', 'excesso de exação', 'excesso de exacao',
      'tráfico de influência', 'trafico de influencia',
      'advocacia administrativa',
    ],
    frases: [
      // === Testemunho direto ===
      'vi funcionário', 'vi servidor', 'presenciei irregularidade',
      'fui testemunha', 'presenciei', 'eu vi',
      'aconteceu na minha frente', 'na minha presença', 'na minha presenca',

      // === Provas ===
      'tenho provas', 'posso provar', 'tenho como provar',
      'tenho fotos', 'tenho vídeos', 'tenho videos', 'tenho gravação', 'tenho gravacao',
      'tenho documentos', 'posso comprovar', 'tenho comprovantes',
      'está documentado', 'esta documentado', 'está gravado', 'esta gravado',

      // === Desvio/Roubo ===
      'está desviando', 'esta desviando', 'está roubando', 'esta roubando',
      'desviou dinheiro', 'desviou verba', 'desviaram recursos',
      'sumiu com o dinheiro', 'sumiram com os recursos',
      'não prestou contas', 'nao prestou contas',

      // === Propina/Suborno ===
      'pediu dinheiro', 'exigiu pagamento', 'cobrou propina',
      'pediu por fora', 'cobrou por fora', 'quer dinheiro',
      'só resolve se pagar', 'so resolve se pagar',
      'quer um agrado', 'pediu um agrado', 'pediu um extra',
      'não faz sem pagar', 'nao faz sem pagar',

      // === Obras e contratos ===
      'obra fantasma', 'obra parada', 'obra que não existe', 'obra que nao existe',
      'contrato irregular', 'contrato fraudado', 'licitação fraudada', 'licitacao fraudada',
      'licitação direcionada', 'licitacao direcionada', 'edital viciado',
      'empresa de fachada', 'empresa laranja',

      // === Uso indevido ===
      'uso indevido', 'uso particular', 'uso pessoal',
      'usando carro oficial', 'usando veículo oficial', 'usando veiculo oficial',
      'usando para fins pessoais', 'usando para interesse próprio', 'usando para interesse proprio',
      'fora do expediente', 'em horário de trabalho', 'em horario de trabalho',

      // === Nepotismo ===
      'contratou parente', 'nomeou familiar', 'colocou o filho',
      'empregou a esposa', 'empregou o marido', 'empregou amigo',
      'cargo para o filho', 'cargo para parente',

      // === Assédio ===
      'está me assediando', 'esta me assediando',
      'faz ameaças', 'faz ameacas', 'me ameaçou', 'me ameacou',
      'me persegue', 'me humilha', 'me intimida',
      'ambiente hostil', 'clima de terror',

      // === Funcionário fantasma ===
      'não aparece para trabalhar', 'nao aparece para trabalhar',
      'nunca está lá', 'nunca esta la', 'só aparece no dia do pagamento', 'so aparece no dia do pagamento',
      'bate ponto e vai embora', 'só assina o ponto', 'so assina o ponto',
      'recebe sem trabalhar', 'ganha sem fazer nada',

      // === Expressões coloquiais ===
      'tá roubando', 'ta roubando', 'estão roubando', 'estao roubando',
      'fazendo coisa errada', 'tem coisa errada',
      'não é certo', 'nao e certo', 'isso não é correto', 'isso nao e correto',
      'muito estranho', 'coisa estranha', 'algo errado',
      'cheira mal', 'mal cheiroso', 'tá fedendo', 'ta fedendo',
      'tá tudo errado', 'ta tudo errado',

      // === Denúncias de segurança pública (coloquiais) ===
      'to denunciando', 'tô denunciando', 'estou denunciando',
      'quero denunciar', 'venho denunciar',
      'virou ponto de', 'virou boca', 'virou ponto de drogas',
      'moradores com medo', 'estamos com medo', 'população com medo',
      'pessoas estranhas', 'gente estranha', 'elementos estranhos',
      'toda noite', 'toda madrugada', 'de noite aparecem',
      'ninguém faz nada', 'ninguem faz nada', 'ngm faz nada',
      'já vi', 'ja vi', 'eu vi', 'presenciei',
      'caminhão despejando', 'caminhao despejando', 'jogando lixo',
      'jogando entulho', 'despejando', 'descartando',
      'área de preservação', 'area de preservacao', 'área ambiental', 'area ambiental',
      'destruindo a natureza', 'destruindo o meio ambiente',
    ],
  },

  elogio: {
    peso: 1.0,
    palavras: [
      // === Palavras diretas ===
      'elogio', 'elogiar', 'elogiado', 'elogiando',
      'parabéns', 'parabenizar', 'parabens',
      'congratulações', 'congratulacoes', 'felicitações', 'felicitacoes',

      // === Agradecimento ===
      'agradecer', 'agradecimento', 'gratidão', 'gratidao', 'grato', 'grata',
      'obrigado', 'obrigada', 'muito obrigado', 'muito obrigada',
      'reconhecimento', 'reconhecer', 'valorizar',

      // === Qualidade excelente ===
      'excelente', 'ótimo', 'otimo', 'maravilhoso', 'incrível', 'incrivel',
      'fantástico', 'fantastico', 'extraordinário', 'extraordinario',
      'espetacular', 'impressionante', 'impecável', 'impecavel',
      'perfeito', 'perfeita', 'sensacional', 'brilhante',
      'nota 10', 'nota dez', 'cinco estrelas', '5 estrelas',
      'de primeira', 'de primeira linha', 'primeira qualidade',

      // === Eficiência ===
      'eficiente', 'eficiência', 'eficiencia', 'eficaz', 'eficácia', 'eficacia',
      'rápido', 'rapido', 'ágil', 'agil', 'agilidade',
      'veloz', 'célere', 'celere', 'ligeiro',
      'pontual', 'pontualidade', 'no prazo', 'antes do prazo',

      // === Competência ===
      'competente', 'competência', 'competencia', 'capaz', 'capacidade',
      'qualificado', 'qualificada', 'preparado', 'preparada',
      'habilidoso', 'habilidosa', 'expert', 'especialista',

      // === Atendimento ===
      'educado', 'educada', 'cordial', 'atencioso', 'atenciosa',
      'simpático', 'simpatico', 'simpática', 'simpatica',
      'gentil', 'gentileza', 'prestativo', 'prestativa',
      'solícito', 'solicito', 'solícita', 'solicita',
      'acolhedor', 'acolhedora', 'receptivo', 'receptiva',
      'caloroso', 'calorosa', 'amigável', 'amigavel',

      // === Profissionalismo ===
      'profissional', 'profissionalismo', 'profissional exemplar',
      'dedicado', 'dedicada', 'dedicação', 'dedicacao',
      'comprometido', 'comprometida', 'compromisso',
      'responsável', 'responsavel', 'responsabilidade',
      'ético', 'etico', 'ética', 'etica', 'íntegro', 'integro',

      // === Superação de expectativas ===
      'superou', 'superando', 'surpreendeu', 'surpreendendo',
      'além', 'alem', 'acima', 'mais do que esperava',
      'excedeu', 'excedendo', 'ultrapassou',

      // === Gírias e coloquialismos positivos ===
      'top', 'topzera', 'show', 'showzaço', 'showzaco',
      'arrasou', 'mitou', 'mandou bem', 'mandou muito bem',
      'lacrou', 'destruiu', 'abafou',
      'de parabéns', 'de parabens', 'merece reconhecimento',
      'diferenciado', 'diferenciada', 'fora de série', 'fora de serie',
      'nota mil', '1000', 'dez', '10',
      'show de bola', 'muito bom', 'muito boa',
      'demais', 'd+', 'sensacional',

      // === Reconhecimento de esforço ===
      'esforçado', 'esforcado', 'esforçada', 'esforcada',
      'trabalhador', 'trabalhadora', 'batalhador', 'batalhadora',
      'incansável', 'incansavel', 'persistente',
      'zeloso', 'zelosa', 'cuidadoso', 'cuidadosa',

      // === Satisfação ===
      'satisfeito', 'satisfeita', 'satisfação', 'satisfacao',
      'contente', 'feliz', 'realizado', 'realizada',
      'encantado', 'encantada', 'admirado', 'admirada',
    ],
    frases: [
      // === Atendimento ===
      'muito bem atendido', 'muito bem atendida', 'bem atendido', 'bem atendida',
      'fui muito bem atendido', 'fui muito bem atendida',
      'atendimento nota 10', 'atendimento nota dez', 'atendimento excelente',
      'atendimento de primeira', 'atendimento impecável', 'atendimento impecavel',
      'atendimento humanizado', 'tratamento exemplar',

      // === Resolução ===
      'resolveram rápido', 'resolveram rapido', 'resolveu meu problema',
      'resolvido no mesmo dia', 'resolvido na hora',
      'problema solucionado', 'questão resolvida', 'questao resolvida',
      'deu tudo certo', 'funcionou perfeitamente',

      // === Reconhecimento de funcionário ===
      'funcionário exemplar', 'funcionario exemplar',
      'servidor exemplar', 'servidora exemplar',
      'profissional exemplar', 'profissional de excelência', 'profissional de excelencia',
      'funcionário competente', 'funcionario competente',
      'servidor dedicado', 'servidora dedicada',
      'merece reconhecimento', 'merece promoção', 'merece promocao',

      // === Agradecimento ===
      'quero agradecer', 'gostaria de agradecer', 'venho agradecer',
      'meu muito obrigado', 'minha gratidão', 'minha gratidao',
      'deixar meu agradecimento', 'registrar meu agradecimento',
      'agradecer publicamente', 'prestar homenagem',

      // === Superação ===
      'fez além do esperado', 'fez alem do esperado',
      'superou minhas expectativas', 'acima das expectativas',
      'surpreendeu positivamente', 'me surpreendeu',
      'foi além', 'foi alem', 'fez mais do que o necessário', 'fez mais do que o necessario',
      'se desdobrou para ajudar', 'não mediu esforços', 'nao mediu esforcos',

      // === Qualidade do serviço ===
      'serviço de qualidade', 'servico de qualidade',
      'serviço excelente', 'servico excelente',
      'trabalho bem feito', 'trabalho impecável', 'trabalho impecavel',
      'obra bem executada', 'resultado perfeito',

      // === Coloquialismos positivos ===
      'muito bom', 'muito boa', 'muito top',
      'mandou bem demais', 'arrasou demais',
      'show de atendimento', 'show de profissionalismo',
      'de parabéns', 'de parabens', 'está de parabéns', 'esta de parabens',
      'nota mil', 'nota 1000',

      // === Satisfação geral ===
      'estou muito satisfeito', 'estou muito satisfeita',
      'fiquei muito satisfeito', 'fiquei muito satisfeita',
      'saí satisfeito', 'sai satisfeito', 'saí satisfeita', 'sai satisfeita',
      'saí feliz', 'sai feliz', 'saí contente', 'sai contente',
      'adorei o atendimento', 'amei o atendimento',

      // === Recomendação ===
      'recomendo', 'super recomendo', 'indico',
      'vou indicar', 'vou recomendar',
      'todo mundo deveria', 'exemplo a ser seguido',
    ],
  },

  sugestao: {
    peso: 1.0, // Peso aumentado para competir com informacao
    palavras: [
      // === Palavras diretas ===
      'sugestão', 'sugestao', 'sugerir', 'sugiro', 'sugerindo',
      'proposta', 'propor', 'proponho', 'propondo',
      'ideia', 'ideias', 'idéia', 'idéias',

      // === Melhoria ===
      'melhoria', 'melhorias', 'aperfeiçoamento', 'aperfeicoamento',
      'aprimoramento', 'aprimorar', 'otimização', 'otimizacao', 'otimizar',
      'modernização', 'modernizacao', 'modernizar',
      'atualização', 'atualizacao', 'atualizar',

      // === Criação/Implementação ===
      'implementar', 'implementação', 'implementacao',
      'criar', 'criação', 'criacao',
      'desenvolver', 'desenvolvimento',
      'construir', 'construção', 'construcao',
      'instalar', 'instalação', 'instalacao',
      'implantar', 'implantação', 'implantacao',

      // === Inovação ===
      'inovar', 'inovação', 'inovacao', 'inovador', 'inovadora',
      'novidade', 'novo', 'nova', 'diferente',
      'alternativa', 'alternativo',

      // === Mudança ===
      'mudança', 'mudanca', 'mudar', 'alterar', 'alteração', 'alteracao',
      'modificar', 'modificação', 'modificacao',
      'reformular', 'reformulação', 'reformulacao',
      'reestruturar', 'reestruturação', 'reestruturacao',
      'repensar', 'revisar', 'revisão', 'revisao',

      // === Adição ===
      'adicionar', 'adição', 'adicao', 'acrescentar',
      'incluir', 'inclusão', 'inclusao',
      'inserir', 'ampliar', 'ampliação', 'ampliacao',
      'expandir', 'expansão', 'expansao',
      'estender', 'extensão', 'extensao',

      // === Opinião construtiva ===
      'contribuição', 'contribuicao', 'contribuir',
      'colaborar', 'colaboração', 'colaboracao',
      'opinião', 'opiniao', 'palpite', 'dica',
      'insight', 'visão', 'visao',

      // === Gírias e coloquialismos ===
      'dar um toque', 'uma forcinha', 'ajudar',
      'pitaco', 'dar pitaco', 'minha humilde opinião', 'minha humilde opiniao',
    ],
    frases: [
      // === Frases de sugestão direta ===
      'sugiro que', 'gostaria de sugerir', 'venho sugerir',
      'minha sugestão', 'minha sugestao', 'tenho uma sugestão', 'tenho uma sugestao',
      'quero sugerir', 'deixo como sugestão', 'deixo como sugestao',
      'fica a sugestão', 'fica a sugestao', 'fica a dica',

      // === Propostas ===
      'minha proposta', 'tenho uma proposta', 'proponho que',
      'gostaria de propor', 'venho propor',
      'seria interessante', 'seria bom se', 'seria ótimo se', 'seria otimo se',
      'seria legal se', 'seria bacana se', 'seria útil se', 'seria util se',

      // === Ideias ===
      'uma ideia seria', 'uma idéia seria', 'minha ideia é', 'minha ideia e',
      'tenho uma ideia', 'tenho uma idéia', 'pensei em uma ideia', 'pensei em uma idéia',
      'tive uma ideia', 'tive uma idéia', 'me veio uma ideia', 'me veio uma idéia',

      // === Perguntas retóricas ===
      'por que não', 'por que nao', 'porque não', 'porque nao',
      'que tal', 'e se', 'já pensaram em', 'ja pensaram em',
      'já consideraram', 'ja consideraram', 'não seria melhor', 'nao seria melhor',
      'não seria interessante', 'nao seria interessante',

      // === Criação/Implementação ===
      'poderia ser criado', 'poderia ser implementado',
      'poderia haver', 'poderia existir', 'poderia ter',
      'deveria haver', 'deveria existir', 'deveria ter',
      'precisamos de', 'precisaria de', 'faz falta',
      'está faltando', 'esta faltando', 'falta um', 'falta uma',

      // === Melhorias ===
      'para melhorar', 'como melhoria', 'uma melhoria seria',
      'ajudaria se', 'facilitaria se', 'resolveria se',
      'seria mais fácil', 'seria mais facil', 'seria mais prático', 'seria mais pratico',
      'seria mais eficiente', 'seria mais rápido', 'seria mais rapido',

      // === Contribuição ===
      'gostaria de contribuir', 'minha contribuição', 'minha contribuicao',
      'quero contribuir', 'como contribuição', 'como contribuicao',
      'deixo minha contribuição', 'deixo minha contribuicao',

      // === Coloquialismos ===
      'dar uma olhada', 'pensar em', 'levar em conta',
      'seria da hora', 'seria demais', 'ia ser bom',
      'ia ajudar muito', 'ia facilitar', 'ia resolver',
      'faz sentido', 'vale a pena', 'vale pensar',

      // === Específicas para serviços públicos ===
      'criar uma linha', 'criar um ponto', 'criar um posto',
      'ampliar o horário', 'ampliar o horario', 'estender o atendimento',
      'disponibilizar online', 'fazer pelo aplicativo', 'fazer pelo app',
      'digitalizar', 'desburocratizar', 'simplificar',
    ],
  },

  solicitacao: {
    peso: 1.0, // Peso aumentado para competir com informacao
    palavras: [
      // === Palavras diretas ===
      'solicitação', 'solicitacao', 'solicitar', 'solicitando',
      'requerer', 'requerimento', 'requeiro', 'requerendo',
      'pedido', 'pedir', 'peço', 'peco',
      'requisição', 'requisicao', 'requisitar',

      // === Necessidade ===
      'necessidade', 'necessito', 'necessário', 'necessario',
      'preciso', 'precisando', 'precisar',
      'carece', 'carecer', 'carência', 'carencia',
      'urgente', 'urgência', 'urgencia', 'urgentemente',

      // === Instalação ===
      'instalar', 'instalação', 'instalacao',
      'colocar', 'colocação', 'colocacao',
      'implantar', 'implantação', 'implantacao',
      'montar', 'montagem',

      // === Conserto/Reparo ===
      'consertar', 'conserto', 'reparo', 'reparar',
      'arrumar', 'ajeitar', 'corrigir', 'correção', 'correcao',
      'restaurar', 'restauração', 'restauracao',
      'trocar', 'troca', 'substituir', 'substituição', 'substituicao',
      'manutenção', 'manutencao',

      // === Agendamento ===
      'agendar', 'agendamento', 'marcar', 'marcação', 'marcacao',
      'reservar', 'reserva',
      'horário', 'horario', 'data', 'consulta',

      // === Emissão de documentos ===
      'emitir', 'emissão', 'emissao',
      'segunda via', '2a via', '2ª via',
      'certidão', 'certidao', 'declaração', 'declaracao',
      'comprovante', 'atestado', 'laudo',
      'carteira', 'documento', 'identidade', 'rg', 'cpf',

      // === Serviços específicos ===
      'poda', 'podar', 'capina', 'capinar', 'roçagem', 'rocagem', 'roçar', 'rocar',
      'limpeza', 'limpar', 'varrer', 'recolher',
      'iluminação', 'iluminacao', 'iluminar', 'lampada', 'lâmpada', 'poste',
      'sinalização', 'sinalizacao', 'sinalizar', 'placa',
      'asfalto', 'asfaltar', 'pavimentação', 'pavimentacao', 'pavimentar',
      'tapa-buraco', 'tapar buraco', 'buraco',
      'pintura', 'pintar', 'faixa', 'faixas',

      // === Coleta e limpeza ===
      'coleta', 'coletar', 'recolhimento', 'recolher',
      'entulho', 'lixo', 'galhos', 'folhas', 'mato',
      'desentupir', 'desentupimento', 'bueiro', 'boca de lobo',

      // === Água e saneamento ===
      'ligação de água', 'ligacao de agua', 'religar água', 'religar agua',
      'hidrômetro', 'hidrometro', 'cavalete',
      'esgoto', 'fossa', 'rede de esgoto',

      // === Energia ===
      'ligação de luz', 'ligacao de luz', 'religar luz',
      'medidor', 'relógio de luz', 'relogio de luz',

      // === Transporte ===
      'ponto de ônibus', 'ponto de onibus', 'abrigo', 'cobertura',
      'linha de ônibus', 'linha de onibus', 'itinerário', 'itinerario',
      'passagem', 'bilhete', 'cartão', 'cartao', 'recarga',

      // === Gírias e coloquialismos ===
      'dar um jeito', 'resolver', 'providenciar', 'providência', 'providencia',
      'cuidar', 'tratar', 'atender',
    ],
    frases: [
      // === FRASES DE ABERTURA FORTES ===
      'gostaria de solicitar informações', 'gostaria de solicitar informacoes',
      'solicito informações sobre', 'solicito informacoes sobre',
      'como tirar', 'como faço para tirar', 'como faco para tirar',
      'como obter', 'como faço para obter', 'como faco para obter',
      'preciso saber quais', 'quais documentos preciso',

      // === Solicitação formal ===
      'gostaria de solicitar', 'venho solicitar', 'solicito que',
      'venho requerer', 'requeiro que', 'faço o pedido',
      'encaminho solicitação', 'encaminho solicitacao',
      'formalizo pedido', 'registro solicitação', 'registro solicitacao',

      // === Instalação ===
      'venho solicitar a instalação', 'venho solicitar a instalacao',
      'peço a instalação', 'peco a instalacao',
      'solicito a instalação', 'solicito a instalacao',
      'preciso que instalem', 'precisamos de instalação', 'precisamos de instalacao',
      'instalar um', 'instalar uma', 'colocar um', 'colocar uma',

      // === Conserto/Reparo ===
      'venho solicitar o conserto', 'peço o conserto', 'peco o conserto',
      'solicito o conserto', 'solicito o reparo',
      'preciso que consertem', 'preciso que arrumem', 'preciso que troquem',
      'está precisando de conserto', 'esta precisando de conserto',
      'precisa ser consertado', 'precisa ser arrumado', 'precisa ser trocado',

      // === Emissão ===
      'venho solicitar a emissão', 'venho solicitar a emissao',
      'peço a emissão', 'peco a emissao',
      'solicito a emissão', 'solicito a emissao',
      'preciso de uma segunda via', 'preciso da segunda via',
      'gostaria de emitir', 'preciso emitir',

      // === Agendamento ===
      'preciso de um agendamento', 'preciso agendar',
      'gostaria de agendar', 'quero agendar', 'quero marcar',
      'preciso marcar', 'como faço para agendar', 'como faco para agendar',
      'como faço para marcar', 'como faco para marcar',

      // === Atendimento ===
      'necessito de atendimento', 'preciso de atendimento',
      'solicito atendimento', 'peço atendimento', 'peco atendimento',
      'gostaria de ser atendido', 'gostaria de ser atendida',

      // === Serviços urbanos ===
      'solicito a poda', 'preciso de poda', 'árvore precisa de poda', 'arvore precisa de poda',
      'solicito capina', 'preciso de capina', 'mato alto',
      'solicito limpeza', 'preciso de limpeza', 'está sujo', 'esta sujo',
      'solicito iluminação', 'solicito iluminacao', 'poste apagado', 'sem iluminação', 'sem iluminacao',
      'solicito tapa-buraco', 'buraco na rua', 'rua esburacada',
      'solicito coleta', 'recolher entulho', 'recolher lixo',
      'solicito desentupimento', 'bueiro entupido', 'boca de lobo entupida',

      // === Água e saneamento ===
      'solicito ligação de água', 'solicito ligacao de agua',
      'preciso religar a água', 'preciso religar a agua',
      'falta de água', 'falta de agua', 'sem água', 'sem agua',

      // === Transporte ===
      'solicito ponto de ônibus', 'solicito ponto de onibus',
      'preciso de ponto', 'preciso de abrigo', 'preciso de cobertura',
      'solicito nova linha', 'precisamos de linha',

      // === Coloquialismos ===
      'preciso que resolvam', 'preciso que deem um jeito',
      'poderiam providenciar', 'poderiam cuidar',
      'dá pra fazer', 'da pra fazer', 'tem como fazer',
      'seria possível', 'seria possivel', 'é possível', 'e possivel',
      'vocês podem', 'voces podem', 'podem fazer', 'conseguem fazer',
    ],
  },

  informacao: {
    peso: 0.5, // Peso menor pois é muito genérico - reduzido significativamente para evitar falsos positivos
    palavras: [
      // === Palavras diretas ===
      'informação', 'informacao', 'informações', 'informacoes',
      'informar', 'informando',

      // === Dúvida ===
      'dúvida', 'duvida', 'dúvidas', 'duvidas',
      'incerteza', 'questionamento', 'indagação', 'indagacao',

      // === Pergunta ===
      'pergunta', 'perguntar', 'perguntando', 'perguntas',
      'questão', 'questao', 'questões', 'questoes', 'questionar',

      // === Saber/Conhecer ===
      'saber', 'conhecer', 'entender', 'compreender',
      'descobrir', 'verificar', 'confirmar', 'checar',

      // === Funcionamento ===
      'como funciona', 'funcionamento',
      'como faço', 'como faco', 'como fazer',
      'como conseguir', 'como obter',

      // === Localização ===
      'onde', 'aonde', 'localização', 'localizacao', 'endereço', 'endereco',
      'localizar', 'encontrar',

      // === Tempo ===
      'quando', 'horário', 'horario', 'horários', 'horarios',
      'prazo', 'prazos', 'data', 'datas', 'período', 'periodo',
      'dia', 'dias', 'hora', 'horas',

      // === Qual/Quais ===
      'qual', 'quais', 'que tipo', 'quem',

      // === Esclarecimento ===
      'esclarecer', 'esclarecimento', 'esclarecimentos',
      'explicar', 'explicação', 'explicacao',
      'elucidar', 'clarificar', 'clareza',

      // === Orientação ===
      'orientação', 'orientacao', 'orientar', 'orientações', 'orientacoes',
      'direcionamento', 'direcionar', 'guiar', 'guia',
      'instrução', 'instrucao', 'instruções', 'instrucoes', 'instruir',

      // === Requisitos ===
      'requisito', 'requisitos', 'exigência', 'exigencia', 'exigências', 'exigencias',
      'necessário', 'necessario', 'precisa', 'precisar',
      'documentação', 'documentacao', 'documento', 'documentos',

      // === Procedimento ===
      'procedimento', 'procedimentos', 'processo', 'processos',
      'passo', 'passos', 'etapa', 'etapas',
      'trâmite', 'tramite', 'trâmites', 'tramites',

      // === Valor/Custo ===
      'valor', 'valores', 'custo', 'custos', 'preço', 'preco', 'preços', 'precos',
      'taxa', 'taxas', 'tarifa', 'tarifas',
      'quanto custa', 'quanto é', 'quanto e',

      // === Disponibilidade ===
      'disponível', 'disponivel', 'disponibilidade',
      'existe', 'existir', 'há', 'tem',

      // === Gírias e coloquialismos ===
      'rola', 'pode', 'dá', 'da', 'dá pra', 'da pra',
      'tem como', 'consegue', 'sei lá', 'sei la',
    ],
    frases: [
      // === Querer saber ===
      'gostaria de saber', 'quero saber', 'queria saber',
      'preciso saber', 'necessito saber', 'desejo saber',
      'me informe', 'me informem', 'me diga', 'me digam',

      // === Dúvidas ===
      'tenho uma dúvida', 'tenho uma duvida', 'tenho dúvidas', 'tenho duvidas',
      'minha dúvida', 'minha duvida', 'minhas dúvidas', 'minhas duvidas',
      'surgiu uma dúvida', 'surgiu uma duvida', 'ficou uma dúvida', 'ficou uma duvida',
      'estou com dúvida', 'estou com duvida', 'fiquei com dúvida', 'fiquei com duvida',
      'estou em dúvida', 'estou em duvida',

      // === Como fazer ===
      'como faço para', 'como faco para', 'como posso', 'como devo',
      'como eu faço', 'como eu faco', 'como consigo', 'como obtenho',
      'como funciona o', 'como funciona a',
      'de que forma', 'de que maneira', 'qual a forma',

      // === Onde ===
      'onde posso', 'onde devo', 'onde consigo', 'onde encontro',
      'onde fica', 'onde é', 'onde e', 'onde está', 'onde esta',
      'em que local', 'em qual local', 'em que lugar', 'em qual lugar',

      // === Qual/Quais ===
      'qual o procedimento', 'qual procedimento', 'qual é o procedimento', 'qual e o procedimento',
      'qual o prazo', 'qual é o prazo', 'qual e o prazo',
      'qual o valor', 'qual é o valor', 'qual e o valor',
      'qual o horário', 'qual o horario', 'qual é o horário', 'qual e o horario',
      'quais os documentos', 'quais documentos', 'que documentos',
      'quais os requisitos', 'que requisitos',

      // === Solicitar informação ===
      'poderia me informar', 'podem me informar', 'poderiam me informar',
      'pode me dizer', 'podem me dizer', 'poderiam me dizer',
      'pode me explicar', 'podem me explicar', 'poderiam me explicar',
      'preciso de informação', 'preciso de informacao', 'preciso de informações', 'preciso de informacoes',
      'solicito informação', 'solicito informacao', 'solicito informações', 'solicito informacoes',

      // === Esclarecimento ===
      'gostaria de esclarecimento', 'preciso de esclarecimento',
      'pode esclarecer', 'podem esclarecer', 'poderiam esclarecer',
      'me esclareçam', 'me esclareça', 'me esclareca',

      // === Orientação ===
      'gostaria de orientação', 'gostaria de orientacao',
      'preciso de orientação', 'preciso de orientacao',
      'pode me orientar', 'podem me orientar', 'poderiam me orientar',
      'como devo proceder', 'qual o caminho', 'quais os passos',

      // === Confirmação ===
      'é verdade que', 'e verdade que', 'procede que', 'confirma que',
      'está correto', 'esta correto', 'é correto', 'e correto',
      'posso confirmar', 'podem confirmar',

      // === Disponibilidade ===
      'existe', 'há', 'tem', 'vocês tem', 'voces tem',
      'está disponível', 'esta disponivel', 'está aberto', 'esta aberto',
      'está funcionando', 'esta funcionando', 'funciona',

      // === Coloquialismos ===
      'me ajudem', 'me ajuda', 'preciso de ajuda',
      'alguém sabe', 'alguem sabe', 'alguém pode', 'alguem pode',
      'vocês sabem', 'voces sabem', 'tem ideia', 'fazem ideia',
      'não sei', 'nao sei', 'não entendi', 'nao entendi',
      'como é que', 'como e que', 'como assim',
      'tipo assim', 'é assim', 'e assim',
      'não tô entendendo', 'nao to entendendo', 'não estou entendendo', 'nao estou entendendo',
    ],
  },
};

// ============================================================================
// Regras de Classificação por Órgão/Área
// ============================================================================

export const REGRAS_ORGAO: RegrasOrgao = {
  saude: {
    palavras: [
      // === Estabelecimentos ===
      'hospital', 'hospitais', 'pronto-socorro', 'pronto socorro', 'ps',
      'upa', 'emergência', 'emergencia', 'urgência', 'urgencia',
      'posto de saúde', 'posto de saude', 'unidade de saúde', 'unidade de saude',
      'ubs', 'centro de saúde', 'centro de saude', 'clínica', 'clinica',
      'policlínica', 'policlinica', 'ama', 'ame',
      'maternidade', 'berçário', 'bercario',

      // === Profissionais ===
      'médico', 'medico', 'médica', 'medica', 'médicos', 'medicos',
      'doutor', 'doutora', 'dr', 'dra',
      'enfermeiro', 'enfermeira', 'enfermagem', 'técnico de enfermagem', 'tecnico de enfermagem',
      'atendente', 'recepcionista',
      'especialista', 'clínico geral', 'clinico geral',
      'pediatra', 'ginecologista', 'cardiologista', 'ortopedista',
      'neurologista', 'dermatologista', 'oftalmologista', 'urologista',

      // === Medicamentos ===
      'remédio', 'remedio', 'remédios', 'remedios',
      'medicamento', 'medicamentos', 'medicação', 'medicacao',
      'receita', 'receita médica', 'receita medica', 'prescrição', 'prescricao',
      'farmácia', 'farmacia', 'farmácia popular', 'farmacia popular',
      'antibiótico', 'antibiotico', 'analgésico', 'analgesico',

      // === Vacina ===
      'vacina', 'vacinação', 'vacinacao', 'vacinas', 'imunização', 'imunizacao',
      'campanha de vacinação', 'campanha de vacinacao', 'posto de vacinação', 'posto de vacinacao',
      'carteira de vacinação', 'carteira de vacinacao', 'caderneta de vacina',

      // === Exames e procedimentos ===
      'exame', 'exames', 'exame de sangue', 'hemograma', 'raio-x', 'raio x',
      'ultrassom', 'tomografia', 'ressonância', 'ressonancia',
      'eletrocardiograma', 'ecg', 'endoscopia', 'colonoscopia',
      'biópsia', 'biopsia', 'mamografia',

      // === Cirurgia ===
      'cirurgia', 'operação', 'operacao', 'procedimento cirúrgico', 'procedimento cirurgico',
      'centro cirúrgico', 'centro cirurgico', 'anestesia', 'pré-operatório', 'pre-operatorio',
      'pós-operatório', 'pos-operatorio',

      // === Consulta ===
      'consulta', 'consultas', 'atendimento médico', 'atendimento medico',
      'marcar consulta', 'agendar consulta', 'vaga para consulta', 'sem vaga',
      'retorno', 'acompanhamento', 'triagem', 'regulação', 'regulacao',
      'fila de espera', 'lista de espera', 'vaga', 'vagas',

      // === Internação ===
      'leito', 'leitos', 'internação', 'internacao', 'internado', 'internada',
      'alta', 'alta hospitalar', 'uti', 'cti',
      'enfermaria', 'quarto', 'maca', 'corredor',

      // === Ambulância ===
      'ambulância', 'ambulancia', 'samu', 'resgate', 'remoção', 'remocao',

      // === Saúde bucal ===
      'dentista', 'odontologia', 'odontológico', 'odontologico',
      'cárie', 'carie', 'dente', 'dentes', 'extração', 'extracao',
      'canal', 'prótese', 'protese', 'gengiva',

      // === Saúde mental ===
      'saúde mental', 'saude mental', 'caps', 'psiquiatra', 'psiquiatria',
      'psicólogo', 'psicologo', 'psicóloga', 'psicologa', 'psicologia',
      'terapia', 'tratamento psicológico', 'tratamento psicologico',
      'depressão', 'depressao', 'ansiedade', 'transtorno',

      // === Gírias e coloquialismos ===
      'postinho', 'hospitalzinho', 'emergenciazinha',
      'médico de família', 'medico de familia', 'médico da família', 'medico da familia',
      'agente de saúde', 'agente de saude', 'acs', 'ache de saúde', 'ache de saude',
    ],
    entidades: [
      // === Hospitais Regionais ===
      'HRT', 'HRG', 'HRAN', 'HRAS', 'HRS', 'HRC', 'HRP', 'HRBz', 'HRPa', 'HRSM',
      'Hospital Regional de Taguatinga', 'Hospital de Taguatinga',
      'Hospital Regional do Gama', 'Hospital do Gama',
      'Hospital Regional da Asa Norte', 'Hospital da Asa Norte',
      'Hospital Regional da Asa Sul', 'Hospital da Asa Sul',
      'Hospital Regional de Ceilândia', 'Hospital de Ceilândia', 'Hospital de Ceilandia',
      'Hospital Regional de Samambaia', 'Hospital de Samambaia',
      'Hospital Regional de Sobradinho', 'Hospital de Sobradinho',
      'Hospital Regional de Planaltina', 'Hospital de Planaltina',
      'Hospital Regional do Paranoá', 'Hospital do Paranoá', 'Hospital do Paranoa',
      'Hospital Regional de Brazlândia', 'Hospital de Brazlândia', 'Hospital de Brazlandia',
      'Hospital Regional de Santa Maria', 'Hospital de Santa Maria',
      'Hospital de Base', 'HBDF', 'Base',
      'Hospital da Criança', 'Hospital Materno Infantil', 'HMIB',
      'Hospital São Vicente de Paulo', 'Hospital Sao Vicente de Paulo', 'HSVP',

      // === UPAs ===
      'UPA', 'UPA de Ceilândia', 'UPA de Ceilandia', 'UPA do Recanto', 'UPA de Samambaia',
      'UPA de São Sebastião', 'UPA de Sao Sebastiao', 'UPA do Núcleo Bandeirante', 'UPA do Nucleo Bandeirante',
      'UPA de Sobradinho', 'UPA de Planaltina',

      // === UBS/Postos ===
      'UBS', 'Unidade Básica', 'Unidade Basica', 'Posto de Saúde', 'Posto de Saude',
      'Centro de Saúde', 'Centro de Saude',

      // === Órgãos ===
      'SAMU', 'SES', 'SES-DF', 'Secretaria de Saúde', 'Secretaria de Saude',
      'Fundo de Saúde', 'Fundo de Saude', 'FHDF',
    ],
  },

  educacao: {
    palavras: [
      // === Instituições ===
      'escola', 'escolas', 'colégio', 'colegio', 'colégios', 'colegios',
      'creche', 'creches', 'berçário', 'bercario',
      'jardim de infância', 'jardim de infancia', 'pré-escola', 'pre-escola',
      'ensino fundamental', 'ensino médio', 'ensino medio',
      'universidade', 'faculdade', 'unb',

      // === Profissionais ===
      'professor', 'professora', 'professores', 'professoras',
      'mestre', 'educador', 'educadora', 'pedagogo', 'pedagoga',
      'diretor', 'diretora', 'direção', 'direcao',
      'coordenador', 'coordenadora', 'coordenação', 'coordenacao',
      'orientador', 'orientadora', 'orientação educacional', 'orientacao educacional',
      'secretário', 'secretaria', 'secretário escolar', 'secretaria escolar',
      'merendeira', 'cozinheira', 'porteiro', 'zelador', 'servente',
      'monitor', 'monitora', 'cuidador', 'cuidadora',

      // === Alunos ===
      'aluno', 'aluna', 'alunos', 'alunas', 'estudante', 'estudantes',
      'criança', 'criancas', 'crianças', 'adolescente', 'adolescentes',
      'menor', 'menores', 'filho', 'filha', 'filhos',

      // === Matrícula ===
      'matrícula', 'matricula', 'matrículas', 'matriculas',
      'rematrícula', 'rematricula',
      'vaga escolar', 'vaga na escola', 'vaga na creche', 'vagas escolares',
      'inscrição', 'inscricao', 'lista de espera escolar',
      'transferência escolar', 'transferencia escolar', 'transferência', 'transferencia',

      // === Alimentação escolar ===
      'merenda', 'merendas', 'alimentação escolar', 'alimentacao escolar',
      'lanche', 'refeição', 'refeicao', 'comida', 'cantina',
      'cozinha', 'refeitório', 'refeitorio',

      // === Material e uniforme ===
      'uniforme', 'uniformes', 'farda', 'fardamento',
      'material escolar', 'livro', 'livros', 'caderno', 'cadernos',
      'mochila', 'kit escolar',

      // === Transporte ===
      'transporte escolar', 'ônibus escolar', 'onibus escolar',
      'van escolar', 'perua escolar',

      // === Ensino ===
      'ensino', 'educação', 'educacao', 'aprendizagem', 'aprendizado',
      'aula', 'aulas', 'lição', 'licao', 'prova', 'provas',
      'nota', 'notas', 'boletim', 'recuperação', 'recuperacao',
      'reprovação', 'reprovacao', 'aprovação', 'aprovacao',
      'frequência', 'frequencia', 'falta', 'faltas', 'presença', 'presenca',

      // === Infraestrutura escolar ===
      'sala de aula', 'quadra', 'pátio', 'patio', 'biblioteca',
      'laboratório', 'laboratorio', 'informática', 'informatica',
      'banheiro', 'bebedouro', 'ventilador', 'ar-condicionado',
      'carteira', 'cadeira', 'lousa', 'quadro',

      // === Educação especial ===
      'educação especial', 'educacao especial', 'inclusão', 'inclusao',
      'necessidades especiais', 'pne', 'deficiência', 'deficiencia',
      'sala de recursos', 'aee', 'atendimento educacional especializado',
      'intérprete', 'interprete', 'libras', 'braile', 'braille',

      // === Programas educacionais ===
      'tempo integral', 'educação integral', 'educacao integral',
      'reforço escolar', 'reforco escolar', 'contra turno', 'contraturno',
      'enem', 'vestibular', 'pas', 'sisu',

      // === Gírias e coloquialismos ===
      'escolinha', 'crechezinha', 'professorzinho',
    ],
    entidades: [
      // === Tipos de escola ===
      'CEF', 'CED', 'EC', 'CEI', 'CEM', 'CEMEB', 'CAIC',
      'Centro de Ensino Fundamental', 'Centro de Ensino Médio', 'Centro de Ensino Medio',
      'Centro Educacional', 'Centro de Educação Infantil', 'Centro de Educacao Infantil',
      'Escola Classe', 'Escola Parque', 'Escola Técnica', 'Escola Tecnica',
      'Jardim de Infância', 'Jardim de Infancia', 'JI',

      // === Universidades ===
      'UnB', 'UNB', 'Universidade de Brasília', 'Universidade de Brasilia',
      'IFB', 'Instituto Federal de Brasília', 'Instituto Federal de Brasilia',
      'IESB', 'UCB', 'UniCEUB', 'UNICEUB', 'Unip', 'UNIP', 'Anhanguera', 'Estácio', 'Estacio',

      // === Órgãos ===
      'SEEDF', 'SEE', 'SEE-DF', 'Secretaria de Educação', 'Secretaria de Educacao',
      'Regional de Ensino', 'CRE', 'Coordenação Regional', 'Coordenacao Regional',
      'MEC', 'Ministério da Educação', 'Ministerio da Educacao',
      'Conselho de Educação', 'Conselho de Educacao', 'CEDF',
    ],
  },

  transporte: {
    palavras: [
      // === Ônibus ===
      'ônibus', 'onibus', 'ônibus urbano', 'onibus urbano',
      'micro-ônibus', 'micro onibus', 'microônibus', 'microonibus',
      'circular', 'executivo', 'convencional',

      // === Metrô e BRT ===
      'metrô', 'metro', 'metrô-df', 'metro-df',
      'brt', 'expresso df', 'expresso sul',
      'trem', 'vlt',

      // === Tarifa ===
      'passagem', 'passagens', 'tarifa', 'tarifas',
      'preço da passagem', 'preco da passagem', 'valor da passagem',
      'integração', 'integracao', 'integração tarifária', 'integracao tarifaria',
      'meia passagem', 'meia-passagem', 'gratuidade', 'passe livre',
      'idoso', 'estudante', 'deficiente',

      // === Cartões ===
      'bilhete único', 'bilhete unico', 'cartão', 'cartao',
      'cartão de transporte', 'cartao de transporte',
      'recarga', 'recarregar', 'crédito', 'credito',

      // === Profissionais e veículos ===
      'motorista', 'motoristas', 'cobrador', 'cobradores',
      'catraceiro', 'trocador', 'condutor',
      'veículo', 'veiculo', 'frota', 'carro', 'coletivo',

      // === Paradas e terminais ===
      'ponto de ônibus', 'ponto de onibus', 'ponto', 'parada',
      'abrigo', 'cobertura', 'banco', 'assento',
      'terminal', 'terminais', 'estação', 'estacao', 'estações', 'estacoes',
      'rodoviária', 'rodoviaria', 'plataforma',

      // === Linhas e itinerários ===
      'linha', 'linhas', 'itinerário', 'itinerario', 'itinerários', 'itinerarios',
      'rota', 'rotas', 'trajeto', 'trajetos', 'percurso', 'percursos',
      'origem', 'destino', 'ida', 'volta',

      // === Horários ===
      'horário', 'horario', 'horários', 'horarios',
      'frequência', 'frequencia', 'intervalo', 'intervalos',
      'primeiro horário', 'primeiro horario', 'último horário', 'ultimo horario',
      'madrugada', 'pico', 'horário de pico', 'horario de pico',
      'fora do pico', 'fora de pico',

      // === Lotação ===
      'lotado', 'lotação', 'lotacao', 'superlotado', 'superlotação', 'superlotacao',
      'cheio', 'apertado', 'apinhado', 'espremido',
      'vazio', 'poucos passageiros',

      // === Qualidade ===
      'ar-condicionado', 'ar condicionado', 'climatizado', 'calor', 'abafado',
      'sujo', 'sujeira', 'lixo', 'bagunça', 'bagunca',
      'quebrado', 'velho', 'sucateado', 'barulhento',
      'acessibilidade', 'acessível', 'acessivel', 'rampa', 'elevador',
      'cadeirante', 'pne',

      // === Problemas comuns ===
      'atraso', 'atrasado', 'atrasou', 'não veio', 'nao veio',
      'não passou', 'nao passou', 'passou direto', 'não parou', 'nao parou',
      'demorou', 'demora', 'espera',
      'acidente', 'batida', 'colisão', 'colisao',
      'assalto', 'roubo', 'insegurança', 'inseguranca',

      // === Transporte por aplicativo ===
      'uber', 'táxi', 'taxi', '99', 'aplicativo',

      // === Gírias e coloquialismos (DF específico) ===
      'busão', 'busao', 'metro', 'metrôzinho', 'metrozinho',
      'lata velha', 'micro', 'executivão', 'executivao',
    ],
    entidades: [
      // === Empresas de ônibus ===
      'DFTrans', 'DF Trans',
      'BRB Mobilidade', 'Mobilidade',
      'Piracicabana', 'Pira',
      'Urbi', 'URBI',
      'TCB', 'Viação TCB', 'Viacao TCB',
      'Pioneira', 'Viação Pioneira', 'Viacao Pioneira',
      'Marechal', 'Viação Marechal', 'Viacao Marechal',
      'São José', 'Sao Jose', 'Viação São José', 'Viacao Sao Jose',
      'Satélite', 'Satelite', 'Viação Satélite', 'Viacao Satelite',

      // === Metrô ===
      'Metrô-DF', 'Metro-DF', 'Metrô DF', 'Metro DF', 'Companhia do Metropolitano',

      // === Terminais e estações ===
      'Rodoviária do Plano Piloto', 'Rodoviaria do Plano Piloto', 'Rodo',
      'Rodoviária de Taguatinga', 'Rodoviaria de Taguatinga',
      'Rodoviária de Ceilândia', 'Rodoviaria de Ceilandia',
      'Rodoviária do Gama', 'Rodoviaria do Gama',
      'Terminal de Samambaia', 'Terminal do Recanto',
      'Estação Central', 'Estacao Central', 'Galeria', 'Shopping',
      'Estação Águas Claras', 'Estacao Aguas Claras',
      'Estação Guará', 'Estacao Guara',
      'Estação Feira', 'Estacao Feira', 'Estação Ceilândia', 'Estacao Ceilandia',

      // === Órgãos ===
      'Semob', 'SEMOB', 'Secretaria de Mobilidade', 'Secretaria de Transporte',
      'Transporte Urbano', 'DFTRANS',
      'DER', 'DER-DF', 'Departamento de Estradas de Rodagem',
      'DETRAN', 'DETRAN-DF', 'Departamento de Trânsito', 'Departamento de Transito',
    ],
  },

  seguranca: {
    palavras: [
      // === Polícia ===
      'polícia', 'policia', 'policial', 'policiais',
      'policiamento', 'pm', 'militar', 'militares',
      'civil', 'delegado', 'delegada', 'investigador', 'investigadora',
      'agente', 'soldado', 'cabo', 'sargento', 'tenente', 'capitão', 'capitao',

      // === Delegacia ===
      'delegacia', 'delegacias', 'dp', 'distrito policial',
      'deam', 'dpca', 'dca', 'especializada',
      'boletim de ocorrência', 'boletim de ocorrencia', 'bo',
      'ocorrência', 'ocorrencia', 'registro', 'queixa',

      // === Bombeiros ===
      'bombeiro', 'bombeiros', 'corpo de bombeiros',
      'resgate', 'salvamento', 'emergência', 'emergencia',
      'incêndio', 'incendio', 'fogo', 'chamas',
      'afogamento', 'acidente', 'socorro',

      // === Segurança pública ===
      'segurança', 'seguranca', 'segurança pública', 'seguranca publica',
      'ordem pública', 'ordem publica', 'paz social',
      'proteção', 'protecao', 'defesa', 'guarda',

      // === Crimes ===
      'crime', 'crimes', 'criminoso', 'criminosos', 'bandido', 'bandidos',
      'meliante', 'marginal', 'delinquente', 'infrator',
      'roubo', 'roubado', 'roubaram', 'assalto', 'assaltado', 'assaltaram',
      'furto', 'furtado', 'furtaram', 'ladrão', 'ladrao', 'ladrões', 'ladroes',
      'sequestro', 'sequestrado', 'sequestrador',
      'homicídio', 'homicidio', 'assassinato', 'morte', 'mataram',
      'estupro', 'abuso', 'violência sexual', 'violencia sexual',
      'agressão', 'agressao', 'espancamento', 'surra', 'briga',
      'ameaça', 'ameaca', 'intimidação', 'intimidacao',
      'tráfico', 'trafico', 'drogas', 'entorpecentes', 'boca de fumo',
      'arma', 'armas', 'armamento', 'tiro', 'tiros', 'disparo', 'bala',

      // === Violência ===
      'violência', 'violencia', 'violento', 'violenta',
      'perigoso', 'perigosa', 'perigo', 'medo', 'receio', 'temor',
      'inseguro', 'insegura', 'insegurança', 'inseguranca',

      // === Iluminação (relacionada a segurança) ===
      'iluminação', 'iluminacao', 'escuro', 'escuridão', 'escuridao',
      'poste apagado', 'sem luz', 'falta de luz', 'breu',

      // === Presença policial ===
      'patrulha', 'patrulhamento', 'ronda', 'rondas',
      'viatura', 'viaturas', 'carro de polícia', 'carro de policia',
      'presença policial', 'presenca policial', 'ausência policial', 'ausencia policial',
      'batalhão', 'batalhao', 'companhia', 'pelotão', 'pelotao',

      // === Defesa civil ===
      'defesa civil', 'defesa civilzinha', 'proteção civil', 'protecao civil',
      'desastre', 'calamidade', 'enchente', 'alagamento', 'deslizamento',

      // === Violência doméstica ===
      'violência doméstica', 'violencia domestica', 'maria da penha',
      'medida protetiva', 'feminicídio', 'feminicidio',
      'marido', 'esposa', 'companheiro', 'companheira',

      // === Gírias e coloquialismos ===
      'meganhas', 'pm', 'militar', 'polícia militar', 'policia militar',
      'civil', 'polícia civil', 'policia civil',
      'vagabundo', 'mala', 'elemento', 'suspeito', 'suspeitos',
      'tá perigoso', 'ta perigoso', 'área perigosa', 'area perigosa',
      'barra pesada', 'pesado', 'brabo', 'bravo',

      // === Situações de risco / Denúncias de segurança ===
      'ponto de drogas', 'ponto de uso', 'boca', 'boca de fumo', 'traficante', 'traficantes',
      'terreno abandonado', 'casa abandonada', 'prédio abandonado', 'predio abandonado',
      'virou ponto', 'virou boca',
      'pessoas estranhas', 'pessoa estranha', 'gente estranha',
      'movimento estranho', 'movimentação estranha', 'movimentacao estranha',
      'uso de drogas', 'usuário de drogas', 'usuario de drogas',
      'usuário', 'usuario', 'usuários', 'usuarios',
      'matagal', 'área abandonada', 'area abandonada',
      'local perigoso', 'lugar perigoso', 'ponto perigoso',
      'com medo', 'estão com medo', 'estao com medo', 'tenho medo', 'temos medo',
      'medo de sair', 'medo de andar', 'moradores com medo', 'vizinhos com medo',
      'toda noite', 'toda madrugada', 'de noite', 'de madrugada', 'noite aparecem',
      'gritaria', 'barulho', 'confusão', 'confusao', 'briga', 'brigas',
      'vandalismo', 'vândalos', 'vandalos', 'depredação', 'depredacao',
      'pichação', 'pichacao', 'pichado', 'pixação', 'pixacao',
    ],
    entidades: [
      // === Polícia Militar ===
      'PMDF', 'PM-DF', 'Polícia Militar', 'Policia Militar',
      'Polícia Militar do Distrito Federal', 'Policia Militar do Distrito Federal',
      'BPM', 'Batalhão', 'Batalhao', 'BOPE', 'Rotam', 'ROTAM',
      'Patamo', 'PATAMO', 'CPE', 'Choque',

      // === Polícia Civil ===
      'PCDF', 'PC-DF', 'Polícia Civil', 'Policia Civil',
      'Polícia Civil do Distrito Federal', 'Policia Civil do Distrito Federal',
      'Delegacia', 'DP', 'Distrito Policial',
      'DEAM', 'Delegacia da Mulher', 'DPCA', 'DCA',

      // === Bombeiros ===
      'CBMDF', 'CBM-DF', 'Corpo de Bombeiros', 'Corpo de Bombeiros Militar',
      'Bombeiros', 'Bombeiro Militar',

      // === Órgãos ===
      'SSP', 'SSP-DF', 'Secretaria de Segurança', 'Secretaria de Seguranca',
      'Secretaria de Segurança Pública', 'Secretaria de Seguranca Publica',
      'GDF', 'Governo do Distrito Federal',
      'IML', 'Instituto Médico Legal', 'Instituto Medico Legal',
      'IC', 'Instituto de Criminalística', 'Instituto de Criminalistica',
      'PCDF', 'Perícia', 'Pericia',

      // === Defesa civil ===
      'Defesa Civil', 'Defesa Civil do DF',
    ],
  },

  obras: {
    palavras: [
      // === Construção ===
      'obra', 'obras', 'construção', 'construcao', 'construir', 'construindo',
      'edificação', 'edificacao', 'edificar', 'prédio', 'predio', 'edifício', 'edificio',
      'canteiro de obra', 'canteiro de obras',

      // === Reforma ===
      'reforma', 'reformar', 'reformando', 'reformado',
      'revitalização', 'revitalizacao', 'revitalizar',
      'recuperação', 'recuperacao', 'recuperar',
      'restauração', 'restauracao', 'restaurar',
      'ampliação', 'ampliacao', 'ampliar',

      // === Pavimentação ===
      'asfalto', 'asfaltar', 'asfaltamento', 'recapeamento', 'recapear',
      'pavimentação', 'pavimentacao', 'pavimentar', 'pavimento',
      'tapa-buraco', 'tapa buraco', 'tapar buraco', 'operação tapa-buraco', 'operacao tapa-buraco',
      'bloquete', 'bloquetes', 'paralelepípedo', 'paralelepipedo', 'piso intertravado',

      // === Buracos e crateras ===
      'buraco', 'buracos', 'cratera', 'crateras',
      'erosão', 'erosao', 'rachadura', 'rachaduras',
      'afundamento', 'afundou', 'cedeu', 'desnível', 'desnivel',

      // === Calçadas e passeios ===
      'calçada', 'calcada', 'calçadas', 'calcadas',
      'passeio', 'passeios', 'meio-fio', 'meio fio', 'guia',
      'rampa', 'rampas', 'acessibilidade', 'acessível', 'acessivel',
      'piso tátil', 'piso tatil', 'piso podotátil', 'piso podotratil',

      // === Vias ===
      'rua', 'ruas', 'avenida', 'avenidas', 'via', 'vias',
      'rodovia', 'rodovias', 'estrada', 'estradas', 'pista', 'pistas',
      'faixa', 'faixas', 'acostamento',
      'retorno', 'rotatória', 'rotatoria', 'balão', 'balao', 'cruzamento',
      'esquina', 'entroncamento', 'interseção', 'intersecao',

      // === Pontes e viadutos ===
      'ponte', 'pontes', 'viaduto', 'viadutos',
      'passarela', 'passarelas', 'passagem subterrânea', 'passagem subterranea',
      'elevado', 'túnel', 'tunel',

      // === Praças e parques ===
      'praça', 'praca', 'praças', 'pracas', 'pracinha',
      'parque', 'parques', 'área verde', 'area verde',
      'playground', 'parquinho', 'brinquedo', 'brinquedos',
      'banco', 'bancos', 'coreto', 'quiosque',

      // === Manutenção ===
      'manutenção', 'manutencao', 'conservação', 'conservacao',
      'zeladoria', 'limpeza', 'varrição', 'varricao',
      'poda', 'capina', 'roçagem', 'rocagem',

      // === Sinalização ===
      'sinalização', 'sinalizacao', 'sinalizar',
      'placa', 'placas', 'semáforo', 'semaforo', 'semáforos', 'semaforos',
      'faixa de pedestre', 'faixa de pedestres', 'lombada', 'redutor',
      'pintura', 'pintar', 'demarcação', 'demarcacao',

      // === Iluminação pública ===
      'iluminação pública', 'iluminacao publica', 'iluminação', 'iluminacao',
      'poste', 'postes', 'lâmpada', 'lampada', 'luminária', 'luminaria',
      'led', 'luz', 'luzes', 'apagado', 'acender',

      // === Drenagem ===
      'drenagem', 'escoamento', 'galeria', 'galerias',
      'bueiro', 'bueiros', 'boca de lobo',
      'alagamento', 'enchente', 'inundação', 'inundacao',

      // === Gírias e coloquialismos ===
      'esburacado', 'esburacada', 'todo esburacado', 'cheia de buraco',
      'caindo aos pedaços', 'caindo aos pedacos', 'destruído', 'destruido',
      'abandonado', 'abandonada', 'jogado às traças', 'jogado as tracas',
    ],
    entidades: [
      // === NOVACAP ===
      'NOVACAP', 'Companhia Urbanizadora da Nova Capital',

      // === DER ===
      'DER', 'DER-DF', 'Departamento de Estradas de Rodagem',
      'Departamento de Estradas',

      // === Administração Regional ===
      'Administração Regional', 'Administracao Regional', 'RA',
      'Administrador Regional', 'Administrador',

      // === Secretaria de Obras ===
      'SO', 'SODF', 'Secretaria de Obras',
      'Secretaria de Obras e Infraestrutura',
      'Infraestrutura', 'SINESP',

      // === CEB (iluminação) ===
      'CEB', 'Companhia Energética de Brasília', 'Companhia Energetica de Brasilia',
      'CEB Distribuição', 'CEB Distribuicao',

      // === Outras ===
      'AGEFIS', 'Agência de Fiscalização', 'Agencia de Fiscalizacao',
      'IPHAN', 'Patrimônio Histórico', 'Patrimonio Historico',
    ],
  },

  saneamento: {
    palavras: [
      // === Água ===
      'água', 'agua', 'falta de água', 'falta de agua', 'falta água', 'falta agua',
      'sem água', 'sem agua', 'corte de água', 'corte de agua',
      'abastecimento', 'fornecimento', 'distribuição de água', 'distribuicao de agua',
      'caixa d\'água', 'caixa d agua', 'caixa dágua',

      // === Esgoto ===
      'esgoto', 'esgotamento', 'rede de esgoto', 'esgoto sanitário', 'esgoto sanitario',
      'fossa', 'fossa séptica', 'fossa septica',
      'esgoto a céu aberto', 'esgoto a ceu aberto', 'esgoto aberto',
      'dejeto', 'dejetos', 'fezes', 'matéria fecal', 'materia fecal',

      // === Bueiros e drenagem ===
      'bueiro', 'bueiros', 'bueiro aberto', 'bueiro entupido',
      'boca de lobo', 'boca-de-lobo',
      'galeria', 'galerias', 'galeria pluvial',

      // === Problemas ===
      'vazamento', 'vazando', 'vaza', 'vazou',
      'vazamento de esgoto', 'vazamento de água', 'vazamento de agua',
      'estouro', 'estourou', 'rompeu', 'rompimento',
      'entupido', 'entupimento', 'entupiu', 'entope',
      'transbordando', 'transbordou', 'transborda',

      // === Cheiro ===
      'cheiro', 'mau cheiro', 'mal cheiro', 'fedor', 'fedido', 'fedendo',
      'cheiro forte', 'cheiro ruim', 'cheiro de esgoto', 'fede',
      'insuportável', 'insuportavel', 'nojento', 'nojeira',

      // === Equipamentos ===
      'cano', 'canos', 'tubulação', 'tubulacao', 'tubo', 'tubos',
      'torneira', 'hidrômetro', 'hidrometro', 'cavalete', 'registro',
      'manilha', 'manilhas',

      // === Conta/Tarifa ===
      'conta de água', 'conta de agua', 'tarifa', 'cobrança', 'cobranca',
      'segunda via', 'fatura',

      // === Saneamento geral ===
      'saneamento', 'saneamento básico', 'saneamento basico',
      'tratamento', 'tratamento de esgoto', 'estação de tratamento', 'estacao de tratamento',

      // === Problemas climáticos ===
      'enchente', 'alagamento', 'inundação', 'inundacao',
      'alagado', 'alagada', 'cheio de água', 'cheio de agua',

      // === Gírias ===
      'ta vazando', 'tá vazando', 'está vazando',
      'ta fedendo', 'tá fedendo', 'está fedendo',
      'já liguei', 'ja liguei', 'ninguém aparece', 'ninguem aparece',
    ],
    entidades: [
      'CAESB', 'Caesb',
      'Companhia de Saneamento', 'Companhia de Saneamento Ambiental',
      'Saneamento Ambiental do Distrito Federal',
    ],
  },

  'meio-ambiente': {
    palavras: [
      // === Meio ambiente geral ===
      'meio ambiente', 'meio-ambiente', 'ambiental', 'ambientais',
      'ecológico', 'ecologico', 'ecologia', 'sustentável', 'sustentavel',

      // === Vegetação ===
      'árvore', 'arvore', 'árvores', 'arvores',
      'vegetação', 'vegetacao', 'mata', 'mato',
      'floresta', 'cerrado', 'verde', 'área verde', 'area verde',
      'poda', 'podar', 'corte', 'cortar', 'derrubar', 'derrubaram',

      // === Lixo e coleta ===
      'lixo', 'lixeira', 'lixeiras', 'lixão', 'lixao',
      'coleta', 'coleta seletiva', 'recolhimento',
      'reciclagem', 'reciclável', 'reciclavel', 'reciclar',
      'entulho', 'entulhos', 'descarte', 'descarte irregular',
      'resíduo', 'residuo', 'resíduos', 'residuos',

      // === Poluição ===
      'poluição', 'poluicao', 'poluir', 'poluindo',
      'contaminação', 'contaminacao', 'contaminado', 'contaminando',
      'fumaça', 'fumaca', 'fuligem', 'emissão', 'emissao',

      // === Fogo e queimadas ===
      'queimada', 'queimadas', 'queimando', 'queimar',
      'fogo', 'incêndio', 'incendio', 'incêndio florestal', 'incendio florestal',
      'chamas', 'pegando fogo', 'fumaça', 'fumaca',

      // === Fauna ===
      'animal', 'animais', 'fauna', 'bicho', 'bichos',
      'silvestre', 'silvestres', 'maus tratos', 'maus-tratos',
      'abandonado', 'cachorro', 'gato', 'cavalo',

      // === Preservação ===
      'preservação', 'preservacao', 'área de preservação', 'area de preservacao',
      'app', 'área de proteção', 'area de protecao', 'proteção ambiental', 'protecao ambiental',
      'reserva', 'parque ecológico', 'parque ecologico',
      'desmatamento', 'desmate', 'devastação', 'devastacao',

      // === Água e recursos hídricos ===
      'nascente', 'nascentes', 'córrego', 'corrego', 'córregos', 'corregos',
      'rio', 'rios', 'lago', 'lagoa', 'represa',
      'manancial', 'mananciais', 'água', 'agua', 'recurso hídrico', 'recurso hidrico',

      // === Gírias e contextos coloquiais ===
      'jogando lixo', 'jogando entulho', 'despejando',
      'destruindo a natureza', 'destruindo o ambiente',
      'matando animal', 'maltratando animal',
      'caminhão de lixo', 'caminhao de lixo',
      'cheiro de lixo', 'fedido', 'fedor',
    ],
    entidades: [
      'IBRAM', 'Instituto Brasília Ambiental', 'Instituto Brasilia Ambiental',
      'SLU', 'Serviço de Limpeza Urbana', 'Servico de Limpeza Urbana',
      'SEMA', 'Secretaria de Meio Ambiente', 'Secretaria do Meio Ambiente',
      'ICMBio', 'Jardim Botânico', 'Jardim Botanico',
      'Parque Nacional', 'Parque Ecológico', 'Parque Ecologico',
    ],
  },

  documentos: {
    palavras: [
      // === Documentos pessoais ===
      'documento', 'documentos', 'documentação', 'documentacao',
      'identidade', 'carteira de identidade', 'rg', 'cpf',
      'cnh', 'habilitação', 'habilitacao', 'carteira de motorista',
      'passaporte', 'ctps', 'carteira de trabalho',
      'título de eleitor', 'titulo de eleitor', 'eleitor',

      // === Certidões ===
      'certidão', 'certidao', 'certidões', 'certidoes',
      'nascimento', 'casamento', 'óbito', 'obito',
      'certidão de nascimento', 'certidao de nascimento',
      'certidão de casamento', 'certidao de casamento',
      'certidão negativa', 'certidao negativa',
      'antecedentes', 'certidão criminal', 'certidao criminal',

      // === Emissão e segunda via ===
      'segunda via', '2a via', '2ª via',
      'emitir', 'emissão', 'emissao', 'tirar', 'renovar', 'renovação', 'renovacao',
      'primeira via', '1a via', '1ª via',

      // === Atendimento ===
      'na hora', 'na-hora', 'nahora',
      'agendamento', 'agendar', 'marcar',
      'atendimento', 'posto', 'unidade',
      'horário de funcionamento', 'horario de funcionamento',
      'guará', 'guara', 'onde fica', 'mais próximo', 'mais proximo',

      // === Taxas ===
      'taxa', 'taxas', 'emolumentos', 'valor', 'quanto custa',

      // === Coloquialismos ===
      'tirar documento', 'tirar rg', 'tirar identidade',
      'quais documentos', 'que documentos', 'documentos necessários', 'documentos necessarios',
      'preciso levar', 'tenho que levar', 'o que levar',
    ],
    entidades: [
      'Na Hora', 'NaHora',
      'DETRAN', 'DETRAN-DF', 'Departamento de Trânsito', 'Departamento de Transito',
      'Cartório', 'Cartorio', 'Cartórios', 'Cartorios',
      'Receita Federal', 'RFB',
      'Polícia Federal', 'Policia Federal', 'PF',
      'SSP', 'Secretaria de Segurança Pública',
      'TRE', 'Tribunal Regional Eleitoral',
    ],
  },

  'assistencia-social': {
    palavras: [
      // === Assistência social ===
      'assistência social', 'assistencia social', 'social', 'sociais',
      'cras', 'creas', 'centro de referência', 'centro de referencia',

      // === Benefícios e programas ===
      'benefício', 'beneficio', 'benefícios', 'beneficios',
      'bolsa família', 'bolsa familia', 'bolsa',
      'auxílio', 'auxilio', 'auxílio brasil', 'auxilio brasil',
      'auxílio emergencial', 'auxilio emergencial',
      'bpc', 'loas', 'prestação continuada', 'prestacao continuada',
      'passe livre', 'tarifa social',

      // === Cadastro ===
      'cadastro único', 'cadastro unico', 'cadunico', 'cadúnico',
      'cadastro social', 'cadastrar', 'cadastramento',
      'nis', 'número do nis', 'numero do nis',

      // === Família e vulnerabilidade ===
      'família', 'familia', 'famílias', 'familias', 'familiar',
      'vulnerável', 'vulneravel', 'vulnerabilidade',
      'carente', 'carência', 'carencia', 'necessitado', 'necessidade',
      'baixa renda', 'renda', 'sem renda', 'pobreza', 'pobre',
      'desemprego', 'desempregado', 'desempregada', 'perdi emprego', 'perdi o emprego',
      'situação difícil', 'situacao dificil', 'dificuldade financeira',
      'precisando de ajuda', 'ajuda', 'ajudar',

      // === Públicos específicos ===
      'criança', 'crianca', 'crianças', 'criancas',
      'adolescente', 'adolescentes', 'menor',
      'idoso', 'idosa', 'idosos', 'idosas', 'terceira idade',
      'deficiente', 'deficiência', 'deficiencia', 'pcd',
      'gestante', 'grávida', 'gravida',

      // === Moradia ===
      'moradia', 'habitação', 'habitacao', 'casa', 'morar',
      'aluguel social', 'cohabitação', 'coabitacao',
      'sem teto', 'morador de rua', 'situação de rua', 'situacao de rua',

      // === Alimentação ===
      'cesta básica', 'cesta basica', 'alimentação', 'alimentacao',
      'fome', 'passar fome', 'comida',

      // === Gírias e coloquialismos ===
      'to precisando', 'tô precisando', 'estou precisando',
      'ta difícil', 'tá difícil', 'ta dificil', 'está difícil',
      'situação tá', 'situacao ta', 'filhos pequenos',
    ],
    entidades: [
      'CRAS', 'CREAS',
      'SEDEST', 'SEDES', 'Secretaria de Desenvolvimento Social',
      'Secretaria de Assistência Social', 'Secretaria de Assistencia Social',
      'Conselho Tutelar',
      'Bolsa Família', 'Bolsa Familia',
      'Cadastro Único', 'Cadastro Unico', 'CadÚnico', 'CadUnico',
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
