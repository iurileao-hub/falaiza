import Link from "next/link";

/**
 * Página 404 personalizada - exibida quando a rota não é encontrada.
 * Mantém a identidade visual do projeto Participa DF.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md space-y-6">
        <div>
          <p className="text-7xl font-bold text-[#192D4B]">404</p>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#192D4B] mb-2">
            Página não encontrada
          </h1>
          <p className="text-gray-600">
            A página que você procura não existe ou foi movida. Verifique o
            endereço ou volte ao início.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#192D4B] text-white font-medium rounded-lg hover:bg-[#28477D] transition-colors no-underline"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
