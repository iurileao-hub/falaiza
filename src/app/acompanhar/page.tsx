"use client";

import { useState } from "react";
import { Search, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IzaMessage } from "@/components/iza/IzaMessage";

interface Manifestacao {
  protocolo: string;
  tipo: string;
  assunto: string;
  dataEnvio: string;
  status: "enviada" | "em_analise" | "respondida" | "arquivada";
  orgao: string;
}

const statusConfig = {
  enviada: {
    label: "Enviada",
    color: "bg-info text-white",
    icon: FileText,
  },
  em_analise: {
    label: "Em Análise",
    color: "bg-warning text-white",
    icon: Clock,
  },
  respondida: {
    label: "Respondida",
    color: "bg-success text-white",
    icon: CheckCircle,
  },
  arquivada: {
    label: "Arquivada",
    color: "bg-gray-500 text-white",
    icon: AlertCircle,
  },
};

export default function AcompanharPage() {
  const [protocolo, setProtocolo] = useState("");
  const [resultado, setResultado] = useState<Manifestacao | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState("");

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setResultado(null);

    if (!protocolo.trim()) {
      setErro("Por favor, informe o número do protocolo.");
      return;
    }

    setBuscando(true);

    // Simulação de busca - em produção seria uma chamada à API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Dados simulados para demonstração
    if (protocolo.toUpperCase().startsWith("OUV")) {
      setResultado({
        protocolo: protocolo.toUpperCase(),
        tipo: "Reclamação",
        assunto: "Transporte Público",
        dataEnvio: new Date().toLocaleDateString("pt-BR"),
        status: "em_analise",
        orgao: "Secretaria de Transporte e Mobilidade",
      });
    } else {
      setErro(
        "Protocolo não encontrado. Verifique o número e tente novamente."
      );
    }

    setBuscando(false);
  };

  const StatusBadge = ({ status }: { status: Manifestacao["status"] }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="h-4 w-4" />
        {config.label}
      </span>
    );
  };

  return (
    <main id="main-content" className="container py-8">
      <div className="max-w-2xl mx-auto">
        <IzaMessage variant="default">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Acompanhar Manifestação
          </h1>
          <p className="text-text-muted">
            Digite o número do protocolo que você recebeu para consultar o
            status da sua manifestação.
          </p>
        </IzaMessage>

        <form onSubmit={handleBuscar} className="mt-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="protocolo" className="sr-only">
                Número do protocolo
              </label>
              <Input
                id="protocolo"
                type="text"
                placeholder="Ex: OUV-2026-000001"
                value={protocolo}
                onChange={(e) => setProtocolo(e.target.value)}
                aria-describedby={erro ? "erro-protocolo" : undefined}
                className="text-lg"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={buscando}
              className="sm:w-auto"
            >
              {buscando ? (
                <>
                  <span className="animate-spin mr-2">...</span>
                  Buscando
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>

          {erro && (
            <p
              id="erro-protocolo"
              className="mt-3 text-error text-sm flex items-center gap-2"
              role="alert"
            >
              <AlertCircle className="h-4 w-4" />
              {erro}
            </p>
          )}
        </form>

        {resultado && (
          <section
            aria-label="Resultado da busca"
            className="mt-8 bg-surface rounded-lg border border-border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-text-muted">Protocolo</p>
                <p className="text-xl font-bold text-primary">
                  {resultado.protocolo}
                </p>
              </div>
              <StatusBadge status={resultado.status} />
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <dt className="text-sm text-text-muted">Tipo</dt>
                <dd className="font-medium">{resultado.tipo}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Assunto</dt>
                <dd className="font-medium">{resultado.assunto}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Data de Envio</dt>
                <dd className="font-medium">{resultado.dataEnvio}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Órgão Responsável</dt>
                <dd className="font-medium">{resultado.orgao}</dd>
              </div>
            </dl>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-medium mb-3">Histórico</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-success" />
                  <div>
                    <p className="font-medium">Manifestação enviada</p>
                    <p className="text-sm text-text-muted">
                      {resultado.dataEnvio} às 14:30
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-warning" />
                  <div>
                    <p className="font-medium">Em análise pelo órgão</p>
                    <p className="text-sm text-text-muted">
                      {resultado.dataEnvio} às 15:00
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>
        )}

        <div className="mt-8 p-4 bg-surface rounded-lg border border-border">
          <h2 className="font-medium mb-2">Não tem o protocolo?</h2>
          <p className="text-sm text-text-muted">
            Se você fez sua manifestação pelo site e está logado, pode
            encontrá-la em &quot;Meus Registros&quot; no menu. Se enviou de forma
            anônima, utilize o número do protocolo que foi exibido na tela de
            confirmação.
          </p>
        </div>
      </div>
    </main>
  );
}
