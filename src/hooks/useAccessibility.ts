"use client";

import { useState, useCallback, useEffect } from "react";

export interface AccessibilitySettings {
  /** Modo alto contraste ativado */
  highContrast: boolean;
  /** Tamanho da fonte (em %) */
  fontSize: number;
  /** Reduzir animações */
  reduceMotion: boolean;
  /** Espaçamento entre linhas aumentado */
  largeLineHeight: boolean;
  /** Destacar links */
  highlightLinks: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  fontSize: 100,
  reduceMotion: false,
  largeLineHeight: false,
  highlightLinks: false,
};

const STORAGE_KEY = "ouvidoria-accessibility";
const MIN_FONT_SIZE = 75;
const MAX_FONT_SIZE = 200;
const FONT_SIZE_STEP = 25;

export interface UseAccessibilityReturn {
  /** Configurações atuais */
  settings: AccessibilitySettings;
  /** Ativar/desativar alto contraste */
  toggleHighContrast: () => void;
  /** Aumentar tamanho da fonte */
  increaseFontSize: () => void;
  /** Diminuir tamanho da fonte */
  decreaseFontSize: () => void;
  /** Restaurar tamanho da fonte padrão */
  resetFontSize: () => void;
  /** Ativar/desativar redução de movimento */
  toggleReduceMotion: () => void;
  /** Ativar/desativar espaçamento de linhas */
  toggleLargeLineHeight: () => void;
  /** Ativar/desativar destaque de links */
  toggleHighlightLinks: () => void;
  /** Restaurar todas as configurações padrão */
  resetAll: () => void;
  /** Anunciar mensagem para leitores de tela */
  announce: (message: string, priority?: "polite" | "assertive") => void;
}

/**
 * Hook para gerenciar configurações de acessibilidade
 * Persiste no localStorage e aplica classes CSS no documento
 */
export function useAccessibility(): UseAccessibilityReturn {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Carregar configurações do localStorage na montagem
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AccessibilitySettings>;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }

      // Verificar preferência do sistema para reduce motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        setSettings((prev) => ({ ...prev, reduceMotion: true }));
      }

      // Verificar preferência do sistema para alto contraste
      const prefersHighContrast = window.matchMedia(
        "(prefers-contrast: more)"
      ).matches;

      if (prefersHighContrast) {
        setSettings((prev) => ({ ...prev, highContrast: true }));
      }
    } catch (error) {
      console.warn("Erro ao carregar configurações de acessibilidade:", error);
    }

    setIsHydrated(true);
  }, []);

  // Aplicar configurações no documento
  useEffect(() => {
    if (!isHydrated || typeof document === "undefined") return;

    const root = document.documentElement;

    // Alto contraste
    root.classList.toggle("high-contrast", settings.highContrast);

    // Tamanho da fonte
    root.style.setProperty("--font-scale", `${settings.fontSize / 100}`);
    root.style.fontSize = `${settings.fontSize}%`;

    // Reduzir movimento
    root.classList.toggle("reduce-motion", settings.reduceMotion);

    // Espaçamento de linhas
    root.classList.toggle("large-line-height", settings.largeLineHeight);

    // Destacar links
    root.classList.toggle("highlight-links", settings.highlightLinks);

    // Persistir no localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn("Erro ao salvar configurações de acessibilidade:", error);
    }
  }, [settings, isHydrated]);

  // Funções de toggle
  const toggleHighContrast = useCallback(() => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const increaseFontSize = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + FONT_SIZE_STEP, MAX_FONT_SIZE),
    }));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - FONT_SIZE_STEP, MIN_FONT_SIZE),
    }));
  }, []);

  const resetFontSize = useCallback(() => {
    setSettings((prev) => ({ ...prev, fontSize: 100 }));
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setSettings((prev) => ({ ...prev, reduceMotion: !prev.reduceMotion }));
  }, []);

  const toggleLargeLineHeight = useCallback(() => {
    setSettings((prev) => ({ ...prev, largeLineHeight: !prev.largeLineHeight }));
  }, []);

  const toggleHighlightLinks = useCallback(() => {
    setSettings((prev) => ({ ...prev, highlightLinks: !prev.highlightLinks }));
  }, []);

  const resetAll = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  // Anunciar para leitores de tela
  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (typeof document === "undefined") return;

      const announcer = document.getElementById("announcer");
      if (announcer) {
        announcer.setAttribute("aria-live", priority);
        announcer.textContent = message;

        // Limpar após um tempo para permitir novos anúncios
        setTimeout(() => {
          announcer.textContent = "";
        }, 1000);
      }
    },
    []
  );

  return {
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
  };
}
