"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OfflineIndicator } from "@/components/layout/OfflineIndicator";

export default function ManifestacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <OfflineIndicator />
    </div>
  );
}
