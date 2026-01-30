// IndexedDB Configuration com Dexie.js
// Persistência offline para PWA Ouvidoria DF

import Dexie, { Table } from "dexie";
import {
  Manifestacao,
  Anexo,
  StatusManifestacao,
  TipoManifestacao,
} from "@/types/manifestacao";
import { ConfiguracoesAcessibilidade } from "@/types/accessibility";

/**
 * Interface para configurações persistidas
 */
interface Configuracao {
  id: string;
  valor: unknown;
  atualizadoEm: Date;
}

/**
 * Interface para fila de sincronização offline
 */
interface FilaSincronizacao {
  id?: number;
  manifestacaoId: number;
  tentativas: number;
  ultimaTentativa: Date | null;
  erro: string | null;
  criadoEm: Date;
}

/**
 * Classe do banco de dados da Ouvidoria
 */
class OuvidoriaDB extends Dexie {
  manifestacoes!: Table<Manifestacao, number>;
  anexos!: Table<Anexo, number>;
  configuracoes!: Table<Configuracao, string>;
  filaSincronizacao!: Table<FilaSincronizacao, number>;

  constructor() {
    super("ouvidoria-df");

    // Versão 1 do schema
    this.version(1).stores({
      manifestacoes: "++id, status, tipo, criadoEm, atualizadoEm",
      anexos: "++id, manifestacaoId, tipo, criadoEm",
      configuracoes: "id",
      filaSincronizacao: "++id, manifestacaoId, criadoEm",
    });

    // Hooks para atualização automática de timestamps
    this.manifestacoes.hook("creating", (primKey, obj) => {
      obj.criadoEm = new Date();
      obj.atualizadoEm = new Date();
    });

    this.manifestacoes.hook("updating", (modifications) => {
      return { ...modifications, atualizadoEm: new Date() };
    });
  }
}

/**
 * Instância singleton do banco
 */
export const db = new OuvidoriaDB();

/**
 * Helpers para Manifestações
 */
export const manifestacaoHelpers = {
  /**
   * Cria nova manifestação (rascunho)
   */
  async criar(dados: Partial<Manifestacao>): Promise<number> {
    const manifestacao: Omit<Manifestacao, "id"> = {
      status: "rascunho",
      etapaAtual: 1,
      tipo: dados.tipo || null,
      assunto: dados.assunto || null,
      relato: dados.relato || "",
      anonimo: dados.anonimo ?? false,
      identificacao: dados.identificacao || null,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    return await db.manifestacoes.add(manifestacao as Manifestacao);
  },

  /**
   * Atualiza manifestação existente
   */
  async atualizar(
    id: number,
    dados: Partial<Manifestacao>
  ): Promise<number> {
    return await db.manifestacoes.update(id, {
      ...dados,
      atualizadoEm: new Date(),
    });
  },

  /**
   * Obtém manifestação por ID
   */
  async obter(id: number): Promise<Manifestacao | undefined> {
    return await db.manifestacoes.get(id);
  },

  /**
   * Obtém último rascunho
   */
  async obterUltimoRascunho(): Promise<Manifestacao | undefined> {
    return await db.manifestacoes
      .where("status")
      .equals("rascunho")
      .reverse()
      .first();
  },

  /**
   * Lista manifestações por status
   */
  async listarPorStatus(status: StatusManifestacao): Promise<Manifestacao[]> {
    return await db.manifestacoes.where("status").equals(status).toArray();
  },

  /**
   * Lista manifestações pendentes de envio
   */
  async listarPendentes(): Promise<Manifestacao[]> {
    return await db.manifestacoes.where("status").equals("pendente").toArray();
  },

  /**
   * Marca manifestação como enviada
   */
  async marcarEnviada(id: number, protocolo: string): Promise<void> {
    await db.manifestacoes.update(id, {
      status: "enviada",
      protocolo,
      enviadoEm: new Date(),
      atualizadoEm: new Date(),
    });
  },

  /**
   * Marca manifestação com erro
   */
  async marcarErro(id: number): Promise<void> {
    await db.manifestacoes.update(id, {
      status: "erro",
      atualizadoEm: new Date(),
    });
  },

  /**
   * Exclui manifestação e seus anexos
   */
  async excluir(id: number): Promise<void> {
    await db.transaction("rw", [db.manifestacoes, db.anexos], async () => {
      await db.anexos.where("manifestacaoId").equals(id).delete();
      await db.manifestacoes.delete(id);
    });
  },

  /**
   * Limpa rascunhos antigos (mais de 7 dias)
   */
  async limparRascunhosAntigos(): Promise<number> {
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const rascunhosAntigos = await db.manifestacoes
      .where("status")
      .equals("rascunho")
      .filter((m) => m.atualizadoEm < seteDiasAtras)
      .toArray();

    const ids = rascunhosAntigos
      .map((r) => r.id)
      .filter((id): id is number => id !== undefined);

    if (ids.length > 0) {
      await db.transaction("rw", [db.manifestacoes, db.anexos], async () => {
        // Remover anexos em batch
        for (const id of ids) {
          await db.anexos.where("manifestacaoId").equals(id).delete();
        }
        // Remover manifestações em batch
        await db.manifestacoes.bulkDelete(ids);
      });
    }

    return rascunhosAntigos.length;
  },
};

/**
 * Helpers para Anexos
 */
export const anexoHelpers = {
  /**
   * Adiciona anexo a uma manifestação
   */
  async adicionar(anexo: Omit<Anexo, "id" | "criadoEm">): Promise<number> {
    return await db.anexos.add({
      ...anexo,
      criadoEm: new Date(),
    } as Anexo);
  },

  /**
   * Lista anexos de uma manifestação
   */
  async listarPorManifestacao(manifestacaoId: number): Promise<Anexo[]> {
    return await db.anexos
      .where("manifestacaoId")
      .equals(manifestacaoId)
      .toArray();
  },

  /**
   * Obtém tamanho total dos anexos
   */
  async tamanhoTotal(manifestacaoId: number): Promise<number> {
    const anexos = await this.listarPorManifestacao(manifestacaoId);
    return anexos.reduce((total, anexo) => total + anexo.tamanho, 0);
  },

  /**
   * Remove anexo
   */
  async remover(id: number): Promise<void> {
    await db.anexos.delete(id);
  },

  /**
   * Remove todos anexos de uma manifestação
   */
  async removerTodos(manifestacaoId: number): Promise<void> {
    await db.anexos.where("manifestacaoId").equals(manifestacaoId).delete();
  },
};

/**
 * Helpers para Configurações
 */
export const configHelpers = {
  /**
   * Salva configuração
   */
  async salvar(id: string, valor: unknown): Promise<void> {
    await db.configuracoes.put({
      id,
      valor,
      atualizadoEm: new Date(),
    });
  },

  /**
   * Obtém configuração
   */
  async obter<T>(id: string, padrao?: T): Promise<T | undefined> {
    const config = await db.configuracoes.get(id);
    return (config?.valor as T) ?? padrao;
  },

  /**
   * Salva configurações de acessibilidade
   */
  async salvarAcessibilidade(config: ConfiguracoesAcessibilidade): Promise<void> {
    await this.salvar("acessibilidade", config);
  },

  /**
   * Obtém configurações de acessibilidade
   */
  async obterAcessibilidade(): Promise<ConfiguracoesAcessibilidade | undefined> {
    return await this.obter<ConfiguracoesAcessibilidade>("acessibilidade");
  },
};

/**
 * Helpers para Fila de Sincronização
 */
export const filaHelpers = {
  /**
   * Adiciona manifestação à fila
   */
  async adicionar(manifestacaoId: number): Promise<number> {
    return await db.filaSincronizacao.add({
      manifestacaoId,
      tentativas: 0,
      ultimaTentativa: null,
      erro: null,
      criadoEm: new Date(),
    });
  },

  /**
   * Obtém itens pendentes na fila
   */
  async obterPendentes(): Promise<FilaSincronizacao[]> {
    return await db.filaSincronizacao.toArray();
  },

  /**
   * Atualiza tentativa
   */
  async atualizarTentativa(id: number, erro?: string): Promise<void> {
    const item = await db.filaSincronizacao.get(id);
    if (item) {
      await db.filaSincronizacao.update(id, {
        tentativas: item.tentativas + 1,
        ultimaTentativa: new Date(),
        erro: erro || null,
      });
    }
  },

  /**
   * Remove da fila
   */
  async remover(id: number): Promise<void> {
    await db.filaSincronizacao.delete(id);
  },

  /**
   * Remove por manifestação
   */
  async removerPorManifestacao(manifestacaoId: number): Promise<void> {
    await db.filaSincronizacao
      .where("manifestacaoId")
      .equals(manifestacaoId)
      .delete();
  },
};

/**
 * Inicializa o banco (verifica compatibilidade)
 */
export async function inicializarDB(): Promise<boolean> {
  try {
    await db.open();
    return true;
  } catch {
    return false;
  }
}

/**
 * Limpa todos os dados (para testes/debug)
 */
export async function limparDB(): Promise<void> {
  await db.transaction(
    "rw",
    [db.manifestacoes, db.anexos, db.configuracoes, db.filaSincronizacao],
    async () => {
      await db.manifestacoes.clear();
      await db.anexos.clear();
      await db.configuracoes.clear();
      await db.filaSincronizacao.clear();
    }
  );
}
