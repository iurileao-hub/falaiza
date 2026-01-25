/**
 * Mock do store de manifestacao para testes
 *
 * Fornece dados mockados para os testes de acessibilidade
 * sem necessidade do Zustand real ou persistencia.
 */

import type { ClassificacaoResultado } from '@/lib/iza';

// Estado mockado padrao
export const mockManifestacao = {
  status: 'rascunho' as const,
  etapaAtual: 1,
  tipo: 'reclamacao' as const,
  assunto: {
    categoria: 'saude',
    subcategoria: 'atendimento',
    descricao: 'Problema no atendimento',
  },
  relato: 'Este e um relato de teste com mais de vinte caracteres para validar o formulario.',
  anonimo: false,
  identificacao: {
    nome: 'Cidadao Teste',
    cpf: '123.456.789-00',
    email: 'teste@email.com',
    telefone: '(61) 99999-9999',
  },
  criadoEm: new Date(),
  atualizadoEm: new Date(),
};

export const mockAnexos = [
  {
    id: 'anexo-1',
    nome: 'documento.pdf',
    tipo: 'documento' as const,
    tamanho: 1024 * 100, // 100KB
    url: 'blob:test-url-1',
    gravadoNativo: false,
  },
];

export const mockClassificacao: ClassificacaoResultado = {
  tipo: {
    id: 'reclamacao',
    nome: 'Reclamacao',
    confianca: 0.85,
  },
  orgao: {
    id: 'saude',
    nome: 'Secretaria de Saude',
    confianca: 0.78,
  },
  entidades: [],
  meta: {
    tempoProcessamento: 150,
    camadaUtilizada: 1,
    modeloVersao: '1.0',
    editadoPeloUsuario: false,
  },
};

// Mock do hook useManifestacaoStore
export const useManifestacaoStore = jest.fn(() => ({
  manifestacao: mockManifestacao,
  anexos: mockAnexos,
  classificacao: mockClassificacao,
  etapaAtual: 1,

  // Actions mockadas
  setTipo: jest.fn(),
  setAssunto: jest.fn(),
  setRelato: jest.fn(),
  setAnonimo: jest.fn(),
  setIdentificacao: jest.fn(),
  setProtocolo: jest.fn(),
  setStatus: jest.fn(),
  setClassificacao: jest.fn(),
  atualizarClassificacao: jest.fn(),
  adicionarAnexo: jest.fn(),
  removerAnexo: jest.fn(),
  limparAnexos: jest.fn(),
  avancarEtapa: jest.fn(),
  voltarEtapa: jest.fn(),
  irParaEtapa: jest.fn(),

  // Validacoes mockadas
  podeAvancar: jest.fn().mockReturnValue(true),
  podeVoltar: jest.fn().mockReturnValue(true),
  permiteAnonimo: jest.fn().mockReturnValue(true),

  // Reset
  resetar: jest.fn(),
}));

// Funcao para criar mock customizado
export const createMockStore = (overrides = {}) => {
  return {
    manifestacao: mockManifestacao,
    anexos: mockAnexos,
    classificacao: mockClassificacao,
    etapaAtual: 1,
    setTipo: jest.fn(),
    setAssunto: jest.fn(),
    setRelato: jest.fn(),
    setAnonimo: jest.fn(),
    setIdentificacao: jest.fn(),
    setProtocolo: jest.fn(),
    setStatus: jest.fn(),
    setClassificacao: jest.fn(),
    atualizarClassificacao: jest.fn(),
    adicionarAnexo: jest.fn(),
    removerAnexo: jest.fn(),
    limparAnexos: jest.fn(),
    avancarEtapa: jest.fn(),
    voltarEtapa: jest.fn(),
    irParaEtapa: jest.fn(),
    podeAvancar: jest.fn().mockReturnValue(true),
    podeVoltar: jest.fn().mockReturnValue(true),
    permiteAnonimo: jest.fn().mockReturnValue(true),
    resetar: jest.fn(),
    ...overrides,
  };
};
