/**
 * Testes de Acessibilidade - Paginas do Wizard
 *
 * Verifica conformidade WCAG 2.1 AA em todas as paginas
 * do fluxo de manifestacao usando axe-core.
 *
 * Paginas testadas:
 * - /manifestacao/relato (Etapa 1)
 * - /manifestacao/sugestao (Etapa 2)
 * - /manifestacao/anexos (Etapa 3)
 * - /manifestacao/identificacao (Etapa 4)
 * - /manifestacao/confirmacao (Etapa 5)
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { axeOptions, formatViolations } from './utils';

// Adiciona matcher customizado
expect.extend(toHaveNoViolations);

// Mock do store de manifestacao
jest.mock('@/stores/manifestacaoStore', () => ({
  useManifestacaoStore: () => ({
    manifestacao: {
      status: 'rascunho',
      etapaAtual: 1,
      tipo: 'reclamacao',
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
    },
    anexos: [
      {
        id: 'anexo-1',
        nome: 'documento.pdf',
        tipo: 'documento',
        tamanho: 102400,
        url: 'blob:test-url-1',
        gravadoNativo: false,
      },
    ],
    classificacao: {
      tipo: { id: 'reclamacao', nome: 'Reclamacao', confianca: 0.85 },
      orgao: { id: 'saude', nome: 'Secretaria de Saude', confianca: 0.78 },
      entidades: [],
      meta: {
        tempoProcessamento: 150,
        camadaUtilizada: 1,
        modeloVersao: '1.0',
        editadoPeloUsuario: false,
      },
    },
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
    podeAvancar: () => true,
    podeVoltar: () => true,
    permiteAnonimo: () => true,
    resetar: jest.fn(),
  }),
}));

// Mock do hook useClassificacao
jest.mock('@/hooks/useClassificacao', () => ({
  useClassificacao: () => ({
    classificar: jest.fn().mockResolvedValue({
      tipo: { id: 'reclamacao', nome: 'Reclamacao', confianca: 0.85 },
      orgao: { id: 'saude', nome: 'Secretaria de Saude', confianca: 0.78 },
      entidades: [],
      meta: { tempoProcessamento: 100, camadaUtilizada: 1 },
    }),
    isLoading: false,
    error: null,
    modelStatus: { downloaded: true, downloading: false, progress: 100 },
    downloadModel: jest.fn(),
  }),
}));

// Mock do fetch para API
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ protocolo: 'OUV-2026-000001' }),
});

// Importa os componentes de pagina apos os mocks
import RelatoPage from '@/app/manifestacao/relato/page';
import SugestaoPage from '@/app/manifestacao/sugestao/page';
import AnexosPage from '@/app/manifestacao/anexos/page';
import IdentificacaoPage from '@/app/manifestacao/identificacao/page';
import ConfirmacaoPage from '@/app/manifestacao/confirmacao/page';

describe('Testes de Acessibilidade - Wizard de Manifestacao', () => {
  /**
   * Etapa 1: Pagina de Relato
   * Verifica textarea, contador de caracteres e botoes de midia
   */
  describe('Pagina de Relato (Etapa 1)', () => {
    it('deve renderizar sem violacoes de acessibilidade', async () => {
      const { container } = render(<RelatoPage />);

      // Aguarda renderizacao completa
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      const results = await axe(container, axeOptions);

      if (results.violations.length > 0) {
        console.log('Violacoes encontradas em RelatoPage:');
        console.log(formatViolations(results.violations));
      }

      expect(results).toHaveNoViolations();
    });

    it('deve ter textarea com label acessivel', async () => {
      render(<RelatoPage />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('aria-describedby');
    });

    it('deve ter botoes de navegacao acessiveis', async () => {
      render(<RelatoPage />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  /**
   * Etapa 2: Pagina de Sugestao
   * Verifica exibicao da classificacao e opcoes de edicao
   */
  describe('Pagina de Sugestao (Etapa 2)', () => {
    it('deve renderizar sem violacoes de acessibilidade', async () => {
      const { container } = render(<SugestaoPage />);

      // Aguarda renderizacao
      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });

      const results = await axe(container, axeOptions);

      if (results.violations.length > 0) {
        console.log('Violacoes encontradas em SugestaoPage:');
        console.log(formatViolations(results.violations));
      }

      expect(results).toHaveNoViolations();
    });
  });

  /**
   * Etapa 3: Pagina de Anexos
   * Verifica area de upload e lista de arquivos
   */
  describe('Pagina de Anexos (Etapa 3)', () => {
    it('deve renderizar sem violacoes de acessibilidade', async () => {
      const { container } = render(<AnexosPage />);

      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });

      const results = await axe(container, axeOptions);

      if (results.violations.length > 0) {
        console.log('Violacoes encontradas em AnexosPage:');
        console.log(formatViolations(results.violations));
      }

      expect(results).toHaveNoViolations();
    });

    it('deve ter botao de remover todos acessivel quando ha anexos', async () => {
      render(<AnexosPage />);

      await waitFor(() => {
        // Verifica se ha botao de remover (quando ha anexos mockados)
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  /**
   * Etapa 4: Pagina de Identificacao
   * Verifica formulario de dados pessoais e opcao de anonimato
   */
  describe('Pagina de Identificacao (Etapa 4)', () => {
    it('deve renderizar sem violacoes de acessibilidade', async () => {
      const { container } = render(<IdentificacaoPage />);

      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });

      const results = await axe(container, axeOptions);

      if (results.violations.length > 0) {
        console.log('Violacoes encontradas em IdentificacaoPage:');
        console.log(formatViolations(results.violations));
      }

      expect(results).toHaveNoViolations();
    });
  });

  /**
   * Etapa 5: Pagina de Confirmacao
   * Verifica resumo e botao de envio
   */
  describe('Pagina de Confirmacao (Etapa 5)', () => {
    it('deve renderizar sem violacoes de acessibilidade', async () => {
      const { container } = render(<ConfirmacaoPage />);

      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });

      const results = await axe(container, axeOptions);

      if (results.violations.length > 0) {
        console.log('Violacoes encontradas em ConfirmacaoPage:');
        console.log(formatViolations(results.violations));
      }

      expect(results).toHaveNoViolations();
    });

    it('deve ter botao de enviar manifestacao', async () => {
      render(<ConfirmacaoPage />);

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /enviar/i });
        expect(submitButton).toBeInTheDocument();
      });
    });

    it('deve ter botoes de edicao com nomes acessiveis', async () => {
      render(<ConfirmacaoPage />);

      await waitFor(() => {
        const editButtons = screen.getAllByRole('button', { name: /editar/i });
        expect(editButtons.length).toBeGreaterThan(0);
      });
    });
  });
});

/**
 * Testes de Acessibilidade Gerais
 * Verifica elementos comuns a todas as paginas
 */
describe('Elementos Comuns de Acessibilidade', () => {
  it('todas as imagens devem ter atributo alt', async () => {
    const { container } = render(<RelatoPage />);

    await waitFor(() => {
      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        // Imagens decorativas podem ter alt vazio, mas devem ter o atributo
        expect(img).toHaveAttribute('alt');
      });
    });
  });

  it('todos os inputs devem ter labels associados', async () => {
    const { container } = render(<IdentificacaoPage />);

    await waitFor(() => {
      const inputs = container.querySelectorAll('input:not([type="hidden"])');
      inputs.forEach((input) => {
        // Verifica se tem label associado via htmlFor ou aria-label/aria-labelledby
        const hasLabel =
          input.hasAttribute('aria-label') ||
          input.hasAttribute('aria-labelledby') ||
          container.querySelector(`label[for="${input.id}"]`);

        expect(hasLabel).toBeTruthy();
      });
    });
  });

  it('foco deve ser visivel em elementos interativos', async () => {
    const { container } = render(<RelatoPage />);

    await waitFor(() => {
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        // Verifica se nao tem outline: none sem estilo alternativo de foco
        const styles = window.getComputedStyle(button);
        // Em ambiente de teste, nao conseguimos verificar CSS real
        // mas podemos verificar se o botao e focavel
        expect(button.tabIndex).not.toBe(-1);
      });
    });
  });
});
