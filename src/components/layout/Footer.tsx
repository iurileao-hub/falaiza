import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sobre */}
          <div>
            <h2 className="font-bold text-lg mb-4">Participa DF</h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Plataforma de participação social do Governo do Distrito Federal.
              Registre manifestações, acompanhe protocolos e participe das
              decisões do GDF.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h2 className="font-bold text-lg mb-4">Links Úteis</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/manifestacao/relato"
                  className="opacity-80 hover:opacity-100 transition-opacity no-underline text-white hover:text-white flex items-center gap-2"
                >
                  Nova Manifestação
                </Link>
              </li>
              <li>
                <Link
                  href="/acompanhar"
                  className="opacity-80 hover:opacity-100 transition-opacity no-underline text-white hover:text-white flex items-center gap-2"
                >
                  Acompanhar Protocolo
                </Link>
              </li>
              <li>
                <Link
                  href="/perguntas-frequentes"
                  className="opacity-80 hover:opacity-100 transition-opacity no-underline text-white hover:text-white flex items-center gap-2"
                >
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <a
                  href="https://www.participa.df.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100 transition-opacity no-underline text-white hover:text-white flex items-center gap-2"
                >
                  Site Oficial
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h2 className="font-bold text-lg mb-4">Contato</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 opacity-80" />
                <div>
                  <p className="font-medium">Central 162</p>
                  <p className="opacity-80">Atendimento 24 horas</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 opacity-80" />
                <div>
                  <p className="opacity-80">ouvidoria@df.gov.br</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 opacity-80" />
                <div>
                  <p className="opacity-80">
                    Palácio do Buriti, Brasília - DF
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Acessibilidade */}
          <div>
            <h2 className="font-bold text-lg mb-4">Acessibilidade</h2>
            <p className="text-sm opacity-80 mb-4">
              Este site segue as diretrizes WCAG 2.1 nível AA.
            </p>
            <p className="text-sm opacity-80">
              Pressione{" "}
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">
                Alt + A
              </kbd>{" "}
              para opções de acessibilidade.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-60">
            <p>
              © {currentYear} Governo do Distrito Federal. Todos os direitos
              reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacidade"
                className="hover:opacity-100 no-underline text-white hover:text-white"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/termos"
                className="hover:opacity-100 no-underline text-white hover:text-white"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
