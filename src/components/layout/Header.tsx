"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Participa DF" },
  { href: "/manifestacao/tipo", label: "Ouvidoria" },
  { href: "/perguntas-frequentes", label: "Perguntas Frequentes" },
  { href: "/acompanhar", label: "Meus Registros" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-white">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/assets/logos/logo-gdf-branca.png"
                alt="GDF - Governo do Distrito Federal"
                width={150}
                height={38}
                className="h-9 w-auto"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Image
              src="/assets/logos/participadf-branca.svg"
              alt="Participa DF"
              width={160}
              height={28}
              className="h-7 w-auto hidden sm:block"
              priority
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              asChild
            >
              <Link href="/login">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        id="navigation"
        className="bg-primary-dark text-white"
        aria-label="Menu principal"
      >
        <div className="container">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1 py-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-colors no-underline text-white hover:text-white"
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
                    className="block px-4 py-3 text-sm font-medium hover:bg-white/10 rounded-md transition-colors no-underline text-white hover:text-white"
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
