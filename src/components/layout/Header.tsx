"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Participa DF" },
  { href: "/manifestacao/relato", label: "Ouvidoria" },
  { href: "/perguntas-frequentes", label: "Perguntas Frequentes" },
  { href: "/acompanhar", label: "Meus Registros" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar - Estilo Participa DF */}
      <div className="bg-[#192D4B] text-white">
        <div className="container flex items-center justify-between py-3">
          {/* Esquerda: Logo GDF + Texto */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:block text-xs leading-tight opacity-90">
              Controladoria-Geral do<br />Distrito Federal
            </span>
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/logos/logo-gdf-branca.png"
                alt="GDF - Governo do Distrito Federal"
                width={60}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Centro: Logo Participa DF */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <Image
                src="/assets/logos/participadf-branca.svg"
                alt="Participa DF"
                width={280}
                height={45}
                className="h-10 md:h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Direita: Botão Entrar */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 flex items-center gap-2 font-medium"
              asChild
            >
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline uppercase tracking-wide">Entrar</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation - Estilo Participa DF */}
      <nav
        id="navigation"
        className="bg-[#28477D] text-white"
        aria-label="Menu principal"
      >
        <div className="container">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center justify-center">
            {navItems.map((item, index) => (
              <li
                key={item.href}
                className={cn(
                  "relative",
                  index !== navItems.length - 1 && "border-r border-white/20"
                )}
              >
                <Link
                  href={item.href}
                  className="block px-6 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors no-underline text-white hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center justify-between py-2">
            <span className="text-sm font-medium">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div
            id="mobile-menu"
            className={cn(
              "md:hidden overflow-hidden transition-all duration-300",
              mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
            )}
          >
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-sm font-medium hover:bg-white/10 transition-colors no-underline text-white hover:text-white border-b border-white/10 last:border-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
