/**
 * Componente de Download do Modelo Local
 * Oferece ao usuário a opção de baixar o modelo de IA para classificações mais precisas
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  baixarModelo,
  getInfoModeloLocal,
  onStatusChange,
  TAMANHO_MODELO_MB,
} from '@/lib/iza';
import {
  Download,
  Wifi,
  Brain,
  CheckCircle,
  XCircle,
  Loader2,
  Shield,
} from 'lucide-react';

interface ModeloLocalDownloadProps {
  /** Se deve mostrar automaticamente quando apropriado */
  autoShow?: boolean;
  /** Callback quando o modelo for baixado com sucesso */
  onModeloReady?: () => void;
  /** Classes adicionais */
  className?: string;
}

type StatusDownload = 'idle' | 'baixando' | 'pronto' | 'erro';

export function ModeloLocalDownload({
  autoShow = true,
  onModeloReady,
  className,
}: ModeloLocalDownloadProps) {
  const [status, setStatus] = useState<StatusDownload>('idle');
  const [progresso, setProgresso] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Verificar estado inicial do modelo
  useEffect(() => {
    const info = getInfoModeloLocal();
    if (info.pronto) {
      setStatus('pronto');
    }

    // Escutar mudanças de estado
    const unsubscribe = onStatusChange((estado) => {
      if (estado.status === 'pronto') {
        setStatus('pronto');
        onModeloReady?.();
      } else if (estado.status === 'erro') {
        setStatus('erro');
        setErro(estado.erro || 'Erro desconhecido');
      }
    });

    return unsubscribe;
  }, [onModeloReady]);

  // Iniciar download
  const handleDownload = useCallback(async () => {
    setStatus('baixando');
    setProgresso(0);
    setErro(null);

    const sucesso = await baixarModelo((p) => {
      setProgresso(Math.round(p * 100));
    });

    if (sucesso) {
      setStatus('pronto');
      onModeloReady?.();
    } else {
      setStatus('erro');
    }
  }, [onModeloReady]);

  // Não mostrar se já está pronto ou foi dispensado
  if (status === 'pronto' || (dismissed && status === 'idle')) {
    return null;
  }

  // Estado de download em progresso
  if (status === 'baixando') {
    return (
      <div
        className={cn(
          'p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3',
          className
        )}
        role="status"
        aria-label="Baixando modelo de IA"
      >
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">
              Baixando modelo de IA...
            </p>
            <p className="text-xs text-blue-600">
              {progresso}% concluído
            </p>
          </div>
        </div>
        <Progress value={progresso} className="h-2" />
        <p className="text-xs text-blue-600 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Seus dados continuam protegidos - processamento 100% local
        </p>
      </div>
    );
  }

  // Estado de erro
  if (status === 'erro') {
    return (
      <div
        className={cn(
          'p-4 bg-red-50 border border-red-200 rounded-lg space-y-3',
          className
        )}
        role="alert"
      >
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              Erro ao baixar modelo
            </p>
            <p className="text-xs text-red-600">
              {erro || 'Verifique sua conexão e tente novamente'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            className="text-red-700 border-red-300 hover:bg-red-100"
          >
            Tentar novamente
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDismissed(true)}
            className="text-red-600"
          >
            Continuar sem IA
          </Button>
        </div>
      </div>
    );
  }

  // Estado inicial - oferta de download
  return (
    <div
      className={cn(
        'p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg space-y-3',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">
            Quer classificações mais precisas?
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Posso baixar um modelo de IA que analisa seu relato com mais detalhes.
            O download é de aproximadamente {TAMANHO_MODELO_MB}MB.
          </p>
        </div>
      </div>

      {/* Aviso de WiFi */}
      <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
        <Wifi className="w-4 h-4 flex-shrink-0" />
        <span>Recomendamos usar WiFi para o download</span>
      </div>

      {/* Benefícios */}
      <ul className="text-xs text-gray-600 space-y-1 pl-1">
        <li className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-green-500" />
          Classificação mais precisa usando inteligência artificial
        </li>
        <li className="flex items-center gap-2">
          <Shield className="w-3 h-3 text-blue-500" />
          100% local - seus dados nunca saem do dispositivo
        </li>
        <li className="flex items-center gap-2">
          <Download className="w-3 h-3 text-purple-500" />
          Download único - fica salvo para próximas visitas
        </li>
      </ul>

      {/* Botões de ação */}
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          onClick={handleDownload}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar modelo
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setDismissed(true)}
          className="text-gray-500"
        >
          Agora não
        </Button>
      </div>
    </div>
  );
}

/**
 * Badge compacto para indicar que o modelo está disponível
 */
export function ModeloLocalBadge({ className }: { className?: string }) {
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const info = getInfoModeloLocal();
    setPronto(info.pronto);

    const unsubscribe = onStatusChange((estado) => {
      setPronto(estado.status === 'pronto');
    });

    return unsubscribe;
  }, []);

  if (!pronto) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full',
        className
      )}
    >
      <Brain className="w-3 h-3" />
      IA Local Ativa
    </span>
  );
}

export default ModeloLocalDownload;
