"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, validarCPF } from "@/lib/utils";
import { IdentificacaoCidadao } from "@/types/manifestacao";

interface IdentificacaoFormProps {
  /** Dados iniciais */
  initialData?: Partial<IdentificacaoCidadao> | null;
  /** Callback quando dados mudam */
  onChange: (data: IdentificacaoCidadao) => void;
  /** Se permite anônimo */
  permiteAnonimo: boolean;
  /** Se está marcado como anônimo */
  anonimo: boolean;
  /** Callback para mudar anonimato */
  onAnonimoChange: (anonimo: boolean) => void;
  /** Erros de validação */
  errors?: Record<string, string>;
  /** Classes CSS adicionais */
  className?: string;
}

// Funções de formatação
const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9)
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
};

const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
};

export function IdentificacaoForm({
  initialData,
  onChange,
  permiteAnonimo,
  anonimo,
  onAnonimoChange,
  errors = {},
  className,
}: IdentificacaoFormProps) {
  const [nome, setNome] = useState(initialData?.nome || "");
  const [cpf, setCpf] = useState(initialData?.cpf || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [telefone, setTelefone] = useState(initialData?.telefone || "");
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Atualizar parent quando dados mudam
  useEffect(() => {
    if (!anonimo) {
      onChange({
        nome,
        cpf: cpf.replace(/\D/g, ""),
        email,
        telefone: telefone.replace(/\D/g, ""),
        notificacoes: true, // Default: receber notificações
      });
    }
  }, [nome, cpf, email, telefone, anonimo, onChange]);

  // Validação local
  const validateField = (field: string, value: string) => {
    const newErrors = { ...localErrors };

    switch (field) {
      case "nome":
        if (value.length > 0 && value.length < 3) {
          newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
        } else {
          delete newErrors.nome;
        }
        break;

      case "cpf":
        const cpfNumbers = value.replace(/\D/g, "");
        if (cpfNumbers.length === 11 && !validarCPF(cpfNumbers)) {
          newErrors.cpf = "CPF inválido";
        } else {
          delete newErrors.cpf;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.length > 0 && !emailRegex.test(value)) {
          newErrors.email = "E-mail inválido";
        } else {
          delete newErrors.email;
        }
        break;

      case "telefone":
        const phoneNumbers = value.replace(/\D/g, "");
        if (phoneNumbers.length > 0 && phoneNumbers.length < 10) {
          newErrors.telefone = "Telefone inválido";
        } else {
          delete newErrors.telefone;
        }
        break;
    }

    setLocalErrors(newErrors);
  };

  const allErrors = { ...localErrors, ...errors };

  if (anonimo && permiteAnonimo) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-start gap-3 p-4 bg-info/10 rounded-lg">
          <Checkbox
            id="anonimo"
            checked={anonimo}
            onCheckedChange={(checked) => onAnonimoChange(checked === true)}
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label htmlFor="anonimo" className="font-medium cursor-pointer">
              Enviar de forma anônima
            </Label>
            <p className="text-sm text-muted mt-1">
              Sua manifestação será registrada sem identificação. Você não
              receberá atualizações sobre o andamento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Opção de anonimato */}
      {permiteAnonimo && (
        <div className="flex items-start gap-3 p-4 bg-surface rounded-lg border">
          <Checkbox
            id="anonimo"
            checked={anonimo}
            onCheckedChange={(checked) => onAnonimoChange(checked === true)}
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label htmlFor="anonimo" className="font-medium cursor-pointer">
              Enviar de forma anônima
            </Label>
            <p className="text-sm text-muted mt-1">
              Marque esta opção se não deseja se identificar.
            </p>
          </div>
        </div>
      )}

      {/* Campos de identificação */}
      <div className="space-y-4">
        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="nome">
            Nome completo <span className="text-error">*</span>
          </Label>
          <Input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              validateField("nome", e.target.value);
            }}
            onBlur={() => validateField("nome", nome)}
            placeholder="Digite seu nome completo"
            aria-invalid={!!allErrors.nome}
            aria-describedby={allErrors.nome ? "nome-error" : undefined}
            className={cn(allErrors.nome && "border-error")}
            required
          />
          {allErrors.nome && (
            <p id="nome-error" className="text-sm text-error">
              {allErrors.nome}
            </p>
          )}
        </div>

        {/* CPF */}
        <div className="space-y-2">
          <Label htmlFor="cpf">
            CPF <span className="text-error">*</span>
          </Label>
          <Input
            id="cpf"
            type="text"
            inputMode="numeric"
            value={cpf}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              setCpf(formatted);
              validateField("cpf", formatted);
            }}
            onBlur={() => validateField("cpf", cpf)}
            placeholder="000.000.000-00"
            aria-invalid={!!allErrors.cpf}
            aria-describedby={allErrors.cpf ? "cpf-error" : undefined}
            className={cn(allErrors.cpf && "border-error")}
            maxLength={14}
            required
          />
          {allErrors.cpf && (
            <p id="cpf-error" className="text-sm text-error">
              {allErrors.cpf}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            E-mail <span className="text-error">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField("email", e.target.value);
            }}
            onBlur={() => validateField("email", email)}
            placeholder="seu.email@exemplo.com"
            aria-invalid={!!allErrors.email}
            aria-describedby="email-hint email-error"
            className={cn(allErrors.email && "border-error")}
            required
          />
          <p id="email-hint" className="text-xs text-muted">
            Você receberá atualizações sobre sua manifestação neste e-mail.
          </p>
          {allErrors.email && (
            <p id="email-error" className="text-sm text-error">
              {allErrors.email}
            </p>
          )}
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label htmlFor="telefone">
            Telefone <span className="text-muted">(opcional)</span>
          </Label>
          <Input
            id="telefone"
            type="tel"
            inputMode="numeric"
            value={telefone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setTelefone(formatted);
              validateField("telefone", formatted);
            }}
            onBlur={() => validateField("telefone", telefone)}
            placeholder="(00) 00000-0000"
            aria-invalid={!!allErrors.telefone}
            aria-describedby={allErrors.telefone ? "telefone-error" : undefined}
            className={cn(allErrors.telefone && "border-error")}
            maxLength={15}
          />
          {allErrors.telefone && (
            <p id="telefone-error" className="text-sm text-error">
              {allErrors.telefone}
            </p>
          )}
        </div>
      </div>

      {/* Nota de privacidade */}
      <p className="text-xs text-muted">
        Seus dados serão tratados de acordo com a Lei Geral de Proteção de Dados
        (LGPD) e utilizados exclusivamente para o processamento desta
        manifestação.
      </p>
    </div>
  );
}
