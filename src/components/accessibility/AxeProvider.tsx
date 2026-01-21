"use client";

import { useEffect } from "react";

/**
 * Componente que inicializa axe-core em desenvolvimento
 * Reporta violações de acessibilidade no console
 */
export function AxeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apenas em desenvolvimento
    if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
      import("@axe-core/react").then(({ default: reactAxe }) => {
        import("react").then((React) => {
          import("react-dom").then((ReactDOM) => {
            reactAxe(React, ReactDOM, 1000).then(() => {
              console.log(
                "%c🔍 axe-core ativado para verificação de acessibilidade",
                "color: #549250; font-weight: bold;"
              );
            });
          });
        });
      });
    }
  }, []);

  return <>{children}</>;
}
