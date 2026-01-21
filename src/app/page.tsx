"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/assets/logos/logo-gdf-branca.png"
              alt="GDF - Governo do Distrito Federal"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/assets/logos/participadf-branca.svg"
              alt="Participa DF"
              width={180}
              height={30}
              className="h-8 w-auto"
              priority
            />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav
        id="navigation"
        className="bg-primary-dark text-white"
        aria-label="Menu principal"
      >
        <div className="container">
          <ul className="flex items-center gap-6 py-3 text-sm">
            <li>
              <Link
                href="/"
                className="hover:text-gdf-yellow transition-colors no-underline"
              >
                Participa DF
              </Link>
            </li>
            <li>
              <Link
                href="/manifestacao/tipo"
                className="hover:text-gdf-yellow transition-colors no-underline font-semibold"
              >
                Ouvidoria
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Offline Banner */}
      {!isOnline && (
        <div
          role="alert"
          className="bg-warning text-white py-2 px-4 text-center text-sm"
        >
          Você está offline. Suas manifestações serão enviadas quando a conexão for restabelecida.
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-surface to-background py-12 md:py-20">
          <div className="container text-center">
            <Image
              src="/assets/logos/Logo-OUV.svg"
              alt="Ouvidoria do Governo do Distrito Federal"
              width={400}
              height={250}
              className="mx-auto mb-8 h-auto max-w-[300px] md:max-w-[400px]"
              priority
            />

            <h1 className="text-2xl md:text-4xl font-bold text-primary mb-4">
              Qual serviço você quer acessar?
            </h1>

            <p className="text-muted max-w-2xl mx-auto mb-12">
              Que bom que você acessou a plataforma de participação social do
              Governo do Distrito Federal. Todos os serviços de Ouvidoria em um
              só lugar.
            </p>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Card Ouvidoria */}
              <Link
                href="/manifestacao/tipo?nova=true"
                className="selection-card group no-underline text-foreground"
              >
                <div className="text-6xl mb-4">🗣️</div>
                <h2 className="text-xl font-bold text-primary mb-2">
                  Ouvidoria
                </h2>
                <p className="text-muted text-sm mb-4">
                  Registre reclamações, denúncias, sugestões, elogios ou
                  solicitações
                </p>
                <span className="btn-primary">Acessar aqui</span>
              </Link>

              {/* Card Acompanhar */}
              <Link
                href="/acompanhar"
                className="selection-card group no-underline text-foreground"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-primary mb-2">
                  Acompanhar
                </h2>
                <p className="text-muted text-sm mb-4">
                  Consulte o andamento de uma manifestação pelo protocolo
                </p>
                <span className="btn-outline">Consultar</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-surface">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-4">📱</div>
                <h3 className="font-bold text-primary mb-2">100% Online</h3>
                <p className="text-muted text-sm">
                  Faça seu registro pelo celular ou computador, a qualquer hora
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="font-bold text-primary mb-2">Seguro</h3>
                <p className="text-muted text-sm">
                  Seus dados são protegidos pela LGPD
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">📞</div>
                <h3 className="font-bold text-primary mb-2">Central 162</h3>
                <p className="text-muted text-sm">
                  Prefere ligar? A Central 162 atende 24 horas
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Participa DF</h4>
              <p className="text-sm opacity-80">
                Plataforma de participação social do Governo do Distrito Federal
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links Úteis</h4>
              <ul className="text-sm space-y-2 opacity-80">
                <li>
                  <a
                    href="https://www.participa.df.gov.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 no-underline text-white hover:text-white"
                  >
                    Site Oficial
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.df.gov.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 no-underline text-white hover:text-white"
                  >
                    GDF
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Acessibilidade</h4>
              <p className="text-sm opacity-80">
                Pressione <kbd className="px-1 bg-white/20 rounded">Alt + A</kbd>{" "}
                para opções de acessibilidade
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-4 text-center text-sm opacity-60">
            <p>
              © {new Date().getFullYear()} Governo do Distrito Federal. Todos os
              direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
