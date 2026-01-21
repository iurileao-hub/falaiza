import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { AccessibilityPanel, AxeProvider } from "@/components/accessibility";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Ouvidoria DF - Participa DF",
  description:
    "Registre sua manifestação para a Ouvidoria do Governo do Distrito Federal. Reclamações, denúncias, sugestões, elogios e solicitações.",
  keywords: [
    "ouvidoria",
    "GDF",
    "Distrito Federal",
    "Brasília",
    "manifestação",
    "reclamação",
    "denúncia",
    "cidadão",
  ],
  authors: [{ name: "Participa DF - GDF" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://ouvidoria.participa.df.gov.br",
    title: "Ouvidoria DF - Participa DF",
    description:
      "Registre sua manifestação para a Ouvidoria do Governo do Distrito Federal",
    siteName: "Participa DF",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ouvidoria DF - Participa DF",
    description:
      "Registre sua manifestação para a Ouvidoria do Governo do Distrito Federal",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#192D4B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Ouvidoria DF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ouvidoria DF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#192D4B" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Preconnect para fontes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Skip Links para Acessibilidade */}
        <a
          href="#main-content"
          className="skip-link"
          tabIndex={0}
        >
          Ir para conteúdo principal
        </a>
        <a
          href="#navigation"
          className="skip-link"
          tabIndex={0}
        >
          Ir para navegação
        </a>

        {/* Conteúdo Principal com verificação de acessibilidade */}
        <AxeProvider>{children}</AxeProvider>

        {/* Live Region para anúncios de acessibilidade */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          id="announcer"
        />

        {/* Painel de Acessibilidade */}
        <AccessibilityPanel />
      </body>
    </html>
  );
}
