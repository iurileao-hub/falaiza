"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Accessibility,
  X,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Link,
  Minus,
  SeparatorHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/hooks/useAccessibility";
import { cn } from "@/lib/utils";

interface AccessibilityPanelProps {
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Painel de acessibilidade flutuante
 * Ativado por Alt+A ou pelo botão de acessibilidade
 */
export function AccessibilityPanel({ className }: AccessibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const {
    settings,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleReduceMotion,
    toggleLargeLineHeight,
    toggleHighlightLinks,
    resetAll,
    announce,
  } = useAccessibility();

  // Atalho de teclado Alt+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        announce(isOpen ? "Painel de acessibilidade fechado" : "Painel de acessibilidade aberto");
      }

      // Fechar com Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        announce("Painel de acessibilidade fechado");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, announce]);

  // Focus management - focus first button when panel opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      // Focus first focusable element in panel
      const firstButton = panelRef.current.querySelector("button");
      firstButton?.focus();

      // Prevent body scroll while panel is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Return focus to trigger button when closed
      if (!isOpen && triggerRef.current) {
        triggerRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Armadilha de foco (focus trap) — impede que o teclado saia do painel modal
  const handlePanelKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: se estiver no primeiro elemento, vai para o último
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab: se estiver no último elemento, volta para o primeiro
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    },
    []
  );

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    announce(!isOpen ? "Painel de acessibilidade aberto" : "Painel de acessibilidade fechado");
  }, [isOpen, announce]);

  const handleHighContrast = useCallback(() => {
    toggleHighContrast();
    announce(settings.highContrast ? "Alto contraste desativado" : "Alto contraste ativado");
  }, [toggleHighContrast, settings.highContrast, announce]);

  const handleIncreaseFontSize = useCallback(() => {
    increaseFontSize();
    announce(`Tamanho da fonte: ${Math.min(settings.fontSize + 25, 200)}%`);
  }, [increaseFontSize, settings.fontSize, announce]);

  const handleDecreaseFontSize = useCallback(() => {
    decreaseFontSize();
    announce(`Tamanho da fonte: ${Math.max(settings.fontSize - 25, 75)}%`);
  }, [decreaseFontSize, settings.fontSize, announce]);

  const handleResetFontSize = useCallback(() => {
    resetFontSize();
    announce("Tamanho da fonte restaurado para 100%");
  }, [resetFontSize, announce]);

  const handleReduceMotion = useCallback(() => {
    toggleReduceMotion();
    announce(settings.reduceMotion ? "Animações ativadas" : "Animações reduzidas");
  }, [toggleReduceMotion, settings.reduceMotion, announce]);

  const handleLargeLineHeight = useCallback(() => {
    toggleLargeLineHeight();
    announce(settings.largeLineHeight ? "Espaçamento normal" : "Espaçamento aumentado");
  }, [toggleLargeLineHeight, settings.largeLineHeight, announce]);

  const handleHighlightLinks = useCallback(() => {
    toggleHighlightLinks();
    announce(settings.highlightLinks ? "Links normais" : "Links destacados");
  }, [toggleHighlightLinks, settings.highlightLinks, announce]);

  const handleResetAll = useCallback(() => {
    resetAll();
    announce("Todas as configurações de acessibilidade foram restauradas");
  }, [resetAll, announce]);

  return (
    <div className={cn("fixed z-50", className)}>
      {/* Botão flutuante */}
      <Button
        ref={triggerRef}
        onClick={handleToggle}
        variant="outline"
        size="lg"
        className={cn(
          "fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg",
          "bg-primary text-white hover:bg-primary-light",
          "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
          "transition-transform hover:scale-105",
          isOpen && "bg-primary-light"
        )}
        aria-label="Abrir painel de acessibilidade (Alt+A)"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <Accessibility className="h-6 w-6" aria-hidden="true" />
      </Button>

      {/* Painel */}
      {isOpen && (
        <div
          ref={panelRef}
          id="accessibility-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Configurações de Acessibilidade"
          onKeyDown={handlePanelKeyDown}
          className={cn(
            "fixed bottom-20 right-4 w-80 max-h-[80vh] overflow-y-auto",
            "bg-white rounded-lg shadow-2xl border border-border",
            "animate-in slide-in-from-bottom-4 fade-in duration-200"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-primary" aria-hidden="true" />
              Acessibilidade
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              className="h-8 w-8 p-0"
              aria-label="Fechar painel de acessibilidade"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Conteúdo */}
          <div className="p-4 space-y-4">
            {/* Alto Contraste */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted">Contraste</p>
              <Button
                onClick={handleHighContrast}
                variant={settings.highContrast ? "default" : "outline"}
                className="w-full justify-start gap-2"
                aria-pressed={settings.highContrast}
              >
                {settings.highContrast ? (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                )}
                {settings.highContrast ? "Alto Contraste Ativo" : "Ativar Alto Contraste"}
              </Button>
            </div>

            {/* Tamanho da Fonte */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted">
                Tamanho da Fonte: {settings.fontSize}%
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleDecreaseFontSize}
                  variant="outline"
                  className="flex-1"
                  disabled={settings.fontSize <= 75}
                  aria-label="Diminuir tamanho da fonte"
                >
                  <ZoomOut className="h-4 w-4 mr-2" aria-hidden="true" />
                  A-
                </Button>
                <Button
                  onClick={handleResetFontSize}
                  variant="outline"
                  className="flex-1"
                  aria-label="Restaurar tamanho padrão"
                  disabled={settings.fontSize === 100}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  onClick={handleIncreaseFontSize}
                  variant="outline"
                  className="flex-1"
                  disabled={settings.fontSize >= 200}
                  aria-label="Aumentar tamanho da fonte"
                >
                  <ZoomIn className="h-4 w-4 mr-2" aria-hidden="true" />
                  A+
                </Button>
              </div>
            </div>

            {/* Opções adicionais */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted">Opções</p>

              <Button
                onClick={handleReduceMotion}
                variant={settings.reduceMotion ? "default" : "outline"}
                className="w-full justify-start gap-2"
                aria-pressed={settings.reduceMotion}
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
                {settings.reduceMotion ? "Animações Reduzidas" : "Reduzir Animações"}
              </Button>

              <Button
                onClick={handleLargeLineHeight}
                variant={settings.largeLineHeight ? "default" : "outline"}
                className="w-full justify-start gap-2"
                aria-pressed={settings.largeLineHeight}
              >
                <SeparatorHorizontal className="h-4 w-4" aria-hidden="true" />
                {settings.largeLineHeight ? "Espaçamento Aumentado" : "Aumentar Espaçamento"}
              </Button>

              <Button
                onClick={handleHighlightLinks}
                variant={settings.highlightLinks ? "default" : "outline"}
                className="w-full justify-start gap-2"
                aria-pressed={settings.highlightLinks}
              >
                <Link className="h-4 w-4" aria-hidden="true" />
                {settings.highlightLinks ? "Links Destacados" : "Destacar Links"}
              </Button>
            </div>

            {/* Restaurar tudo */}
            <div className="pt-2 border-t border-border">
              <Button
                onClick={handleResetAll}
                variant="ghost"
                className="w-full text-muted hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                Restaurar Padrões
              </Button>
            </div>

            {/* Dica de atalho */}
            <p className="text-xs text-center text-muted pt-2">
              Atalho: <kbd className="px-1 py-0.5 bg-surface rounded text-xs">Alt</kbd> +{" "}
              <kbd className="px-1 py-0.5 bg-surface rounded text-xs">A</kbd>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
