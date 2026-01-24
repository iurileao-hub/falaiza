"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { IzaMessage } from "@/components/iza/IzaMessage";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FAQ {
  pergunta: string;
  resposta: string;
  categoria: string;
}

const faqs: FAQ[] = [
  {
    categoria: "Sobre a Ouvidoria",
    pergunta: "O que é a Ouvidoria do Distrito Federal?",
    resposta:
      "A Ouvidoria do Distrito Federal é um canal de comunicação entre o cidadão e o Governo do Distrito Federal. Através dela, você pode registrar reclamações, denúncias, sugestões, elogios e solicitações sobre os serviços públicos do DF.",
  },
  {
    categoria: "Sobre a Ouvidoria",
    pergunta: "Qual a diferença entre os tipos de manifestação?",
    resposta:
      "Reclamação: insatisfação com serviço público. Denúncia: relato de irregularidade ou ilegalidade. Sugestão: proposta de melhoria. Elogio: reconhecimento de bom atendimento. Solicitação: pedido de serviço ou informação. Informação: dúvida sobre serviços públicos.",
  },
  {
    categoria: "Sobre a Ouvidoria",
    pergunta: "Posso fazer uma manifestação anônima?",
    resposta:
      "Sim, para reclamações e denúncias você pode optar por não se identificar. No entanto, manifestações identificadas têm prioridade de resposta e você pode acompanhar o andamento pelo protocolo.",
  },
  {
    categoria: "Como Funciona",
    pergunta: "Qual o prazo para resposta?",
    resposta:
      "O prazo legal é de 20 dias úteis, podendo ser prorrogado por mais 10 dias mediante justificativa. Manifestações sobre serviços essenciais têm prioridade de atendimento.",
  },
  {
    categoria: "Como Funciona",
    pergunta: "Como acompanho minha manifestação?",
    resposta:
      "Você pode acompanhar pelo número do protocolo na página 'Acompanhar Protocolo'. Se criou uma conta, também pode ver todas suas manifestações em 'Meus Registros'.",
  },
  {
    categoria: "Como Funciona",
    pergunta: "Posso anexar arquivos à manifestação?",
    resposta:
      "Sim! Você pode anexar fotos, vídeos, áudios e documentos (PDF, DOC). O limite total é de 25MB. Arquivos de mídia ajudam a ilustrar melhor sua manifestação.",
  },
  {
    categoria: "Acessibilidade",
    pergunta: "O site é acessível para pessoas com deficiência?",
    resposta:
      "Sim, seguimos as diretrizes WCAG 2.1 nível AA. O site é navegável por teclado, compatível com leitores de tela, oferece alto contraste e permite ajuste de tamanho de fonte. Pressione Alt + A para acessar as opções de acessibilidade.",
  },
  {
    categoria: "Acessibilidade",
    pergunta: "Posso gravar áudio em vez de escrever?",
    resposta:
      "Sim! Nossa plataforma permite gravar áudio diretamente pelo navegador. Isso facilita para quem tem dificuldade de digitação ou prefere relatar verbalmente.",
  },
  {
    categoria: "Privacidade",
    pergunta: "Meus dados estão protegidos?",
    resposta:
      "Sim, seguimos a Lei Geral de Proteção de Dados (LGPD). Seus dados pessoais são utilizados apenas para processamento da manifestação e não são compartilhados com terceiros sem sua autorização.",
  },
  {
    categoria: "Privacidade",
    pergunta: "O que acontece com denúncias anônimas?",
    resposta:
      "Denúncias anônimas são tratadas com o mesmo rigor das identificadas. Sua identidade não será revelada em nenhuma circunstância, garantindo sua segurança.",
  },
];

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-surface/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset rounded"
        aria-expanded={isOpen}
      >
        <span className="font-medium pr-4">{faq.pergunta}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-shrink-0 text-text-muted transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        )}
      >
        <p className="text-text-muted leading-relaxed">{faq.resposta}</p>
      </div>
    </div>
  );
}

export default function PerguntasFrequentesPage() {
  const [busca, setBusca] = useState("");
  const [abertos, setAbertos] = useState<number[]>([]);

  const categorias = Array.from(new Set(faqs.map((f) => f.categoria)));

  const faqsFiltradas = faqs.filter(
    (faq) =>
      faq.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
      faq.resposta.toLowerCase().includes(busca.toLowerCase())
  );

  const toggleItem = (index: number) => {
    setAbertos((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <IzaMessage>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Perguntas Frequentes
          </h1>
          <p className="text-text-muted">
            Encontre respostas para as dúvidas mais comuns sobre a Ouvidoria do
            Distrito Federal.
          </p>
        </IzaMessage>

        <div className="mt-8 relative">
          <label htmlFor="busca-faq" className="sr-only">
            Buscar pergunta
          </label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <Input
            id="busca-faq"
            type="search"
            placeholder="Buscar pergunta..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>

        {busca ? (
          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-4">
              {faqsFiltradas.length} resultado(s) para &quot;{busca}&quot;
            </h2>
            {faqsFiltradas.length > 0 ? (
              <div className="bg-white rounded-lg border border-border px-4">
                {faqsFiltradas.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    faq={faq}
                    isOpen={abertos.includes(index)}
                    onToggle={() => toggleItem(index)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-text-muted">
                Nenhuma pergunta encontrada. Tente outros termos ou entre em
                contato conosco.
              </p>
            )}
          </section>
        ) : (
          categorias.map((categoria) => (
            <section key={categoria} className="mt-8">
              <h2 className="text-lg font-semibold mb-4">{categoria}</h2>
              <div className="bg-white rounded-lg border border-border px-4">
                {faqs
                  .filter((f) => f.categoria === categoria)
                  .map((faq, index) => {
                    const globalIndex = faqs.indexOf(faq);
                    return (
                      <AccordionItem
                        key={index}
                        faq={faq}
                        isOpen={abertos.includes(globalIndex)}
                        onToggle={() => toggleItem(globalIndex)}
                      />
                    );
                  })}
              </div>
            </section>
          ))
        )}

        <div className="mt-12 p-6 bg-surface rounded-lg border border-border text-center">
          <h2 className="font-semibold mb-2">Não encontrou sua dúvida?</h2>
          <p className="text-text-muted mb-4">
            Entre em contato conosco pelos canais abaixo:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <span>
              <strong>Central 162</strong> (24 horas)
            </span>
            <span className="hidden sm:inline">|</span>
            <span>ouvidoria@df.gov.br</span>
          </div>
        </div>
      </div>
    </div>
  );
}
