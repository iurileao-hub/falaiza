"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { WizardLayout } from "@/components/wizard/WizardLayout";
import { NavigationButtons } from "@/components/wizard/NavigationButtons";
import { IzaContainer } from "@/components/iza/IzaContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useManifestacaoStore } from "@/stores/manifestacaoStore";
import {
  CATEGORIAS_ASSUNTO,
  ASSUNTOS_POR_CATEGORIA,
} from "@/lib/constants";
import { MENSAGENS_IZA } from "@/lib/iza-messages";
import { CategoriaAssunto } from "@/types/manifestacao";
import { cn } from "@/lib/utils";
import { buscaFuzzy } from "@/lib/utils";

export default function AssuntoPage() {
  const router = useRouter();
  const {
    manifestacao,
    setAssunto,
    podeAvancar,
    etapaAtual,
    irParaEtapa,
  } = useManifestacaoStore();

  const [busca, setBusca] = useState("");
  const [categoriaExpandida, setCategoriaExpandida] = useState<string | null>(
    manifestacao.assunto?.categoria || null
  );

  const categoriaSelecionada = manifestacao.assunto?.categoria;
  const assuntoSelecionado = manifestacao.assunto?.descricao;

  // Filtrar assuntos por busca
  const assuntosFiltrados = useMemo(() => {
    if (!busca || busca.length < 3) return null;

    const resultados: { categoria: CategoriaAssunto; assunto: string }[] = [];

    Object.entries(ASSUNTOS_POR_CATEGORIA).forEach(([cat, assuntos]) => {
      assuntos.forEach((assunto) => {
        if (buscaFuzzy(assunto, busca)) {
          resultados.push({
            categoria: cat as CategoriaAssunto,
            assunto,
          });
        }
      });
    });

    return resultados.slice(0, 20);
  }, [busca]);

  const handleSelectCategoria = (categoria: CategoriaAssunto) => {
    setCategoriaExpandida(
      categoriaExpandida === categoria ? null : categoria
    );
  };

  const handleSelectAssunto = (
    categoria: CategoriaAssunto,
    descricao: string
  ) => {
    setAssunto({ categoria, descricao });
    setBusca("");
  };

  const handleAvancar = () => {
    if (podeAvancar()) {
      irParaEtapa(3);
      router.push("/manifestacao/relato");
    }
  };

  const handleVoltar = () => {
    irParaEtapa(1);
    router.push("/manifestacao/tipo");
  };

  const limparSelecao = () => {
    setAssunto({ categoria: "" as CategoriaAssunto, descricao: "" });
    setCategoriaExpandida(null);
  };

  return (
    <WizardLayout etapaAtual={etapaAtual}>
      {/* Mensagem da IZA */}
      <IzaContainer
        mensagem={
          assuntoSelecionado
            ? MENSAGENS_IZA.assunto.selecao(assuntoSelecionado)
            : manifestacao.tipo
            ? MENSAGENS_IZA.assunto.inicial(manifestacao.tipo)
            : MENSAGENS_IZA.assunto.busca
        }
        variante="lupa"
      />

      {/* Assunto selecionado */}
      {assuntoSelecionado && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-success/10 rounded-lg">
          <span className="text-success font-medium flex-1">
            {assuntoSelecionado}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={limparSelecao}
            aria-label="Remover seleção"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Campo de busca */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
        <Input
          type="search"
          placeholder="Digite para buscar um assunto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-12"
          aria-label="Buscar assunto"
        />
      </div>

      {/* Resultados da busca */}
      {assuntosFiltrados && assuntosFiltrados.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted mb-3">
            {assuntosFiltrados.length} resultado(s) encontrado(s):
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {assuntosFiltrados.map((item, index) => (
              <button
                key={`${item.categoria}-${index}`}
                onClick={() =>
                  handleSelectAssunto(item.categoria, item.assunto)
                }
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg border transition-colors",
                  "hover:border-primary hover:bg-primary/5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                )}
              >
                <p className="font-medium">{item.assunto}</p>
                <p className="text-sm text-muted">
                  {
                    CATEGORIAS_ASSUNTO.find((c) => c.id === item.categoria)
                      ?.nome
                  }
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Categorias */}
      {!assuntosFiltrados && (
        <div className="space-y-3">
          <p className="text-sm text-muted mb-4">
            Ou escolha uma categoria:
          </p>
          {CATEGORIAS_ASSUNTO.map((categoria) => (
            <div key={categoria.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => handleSelectCategoria(categoria.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 text-left transition-colors",
                  "hover:bg-surface",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus",
                  categoriaExpandida === categoria.id && "bg-surface"
                )}
                aria-expanded={categoriaExpandida === categoria.id}
              >
                <span className="text-2xl" aria-hidden="true">
                  {categoria.icone}
                </span>
                <span className="font-medium flex-1">{categoria.nome}</span>
                <span
                  className={cn(
                    "transition-transform",
                    categoriaExpandida === categoria.id && "rotate-180"
                  )}
                >
                  ▼
                </span>
              </button>

              {/* Assuntos da categoria */}
              {categoriaExpandida === categoria.id && (
                <div className="border-t bg-white p-2 space-y-1">
                  {ASSUNTOS_POR_CATEGORIA[categoria.id]?.map((assunto) => (
                    <button
                      key={assunto}
                      onClick={() =>
                        handleSelectAssunto(categoria.id, assunto)
                      }
                      className={cn(
                        "w-full text-left px-4 py-2 rounded text-sm transition-colors",
                        "hover:bg-primary/5",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                        assuntoSelecionado === assunto &&
                          categoriaSelecionada === categoria.id &&
                          "bg-primary/10 font-medium"
                      )}
                    >
                      {assunto}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Navegação */}
      <NavigationButtons
        etapaAtual={2}
        totalEtapas={6}
        podeAvancar={podeAvancar()}
        podeVoltar={true}
        onVoltar={handleVoltar}
        onAvancar={handleAvancar}
        className="mt-8"
      />
    </WizardLayout>
  );
}
