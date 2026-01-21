// Validações com Zod - PWA Ouvidoria DF

import { z } from "zod";
import { VALIDACOES } from "./constants";
import { validarCPF } from "./utils";

/**
 * Schema de CPF com validação real
 */
export const cpfSchema = z
  .string()
  .min(1, "CPF é obrigatório")
  .regex(VALIDACOES.cpf.pattern, "Formato inválido. Use: 000.000.000-00")
  .refine((cpf) => validarCPF(cpf), "CPF inválido");

/**
 * Schema de Email
 */
export const emailSchema = z
  .string()
  .min(1, "E-mail é obrigatório")
  .email("E-mail inválido");

/**
 * Schema de Telefone (opcional)
 */
export const telefoneSchema = z
  .string()
  .optional()
  .refine(
    (tel) => !tel || VALIDACOES.telefone.pattern.test(tel),
    "Formato inválido. Use: (XX) XXXXX-XXXX"
  );

/**
 * Schema de Identificação do Cidadão
 */
export const identificacaoSchema = z.object({
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  cpf: cpfSchema,
  email: emailSchema,
  telefone: telefoneSchema,
  notificacoes: z.boolean().default(true),
});

/**
 * Schema de Assunto
 */
export const assuntoSchema = z.object({
  categoria: z.string().min(1, "Categoria é obrigatória"),
  subcategoria: z.string().optional(),
  descricao: z.string().optional(),
});

/**
 * Schema de Relato
 */
export const relatoSchema = z
  .string()
  .min(
    VALIDACOES.relato.minCaracteres,
    `Relato deve ter pelo menos ${VALIDACOES.relato.minCaracteres} caracteres`
  )
  .max(
    VALIDACOES.relato.maxCaracteres,
    `Relato deve ter no máximo ${VALIDACOES.relato.maxCaracteres} caracteres`
  );

/**
 * Schema de Anexo
 */
export const anexoSchema = z.object({
  tipo: z.enum(["audio", "video", "foto", "documento"]),
  nome: z.string().min(1),
  mimeType: z.string().min(1),
  tamanho: z.number().positive(),
  duracao: z.number().optional(),
});

/**
 * Schema base de Manifestação (sem refine)
 */
const manifestacaoBaseSchema = z.object({
  tipo: z.enum([
    "reclamacao",
    "denuncia",
    "sugestao",
    "elogio",
    "solicitacao",
    "informacao",
  ]),
  assunto: assuntoSchema,
  relato: relatoSchema,
  anonimo: z.boolean(),
  identificacao: identificacaoSchema.nullable(),
});

/**
 * Schema completo de Manifestação com validação condicional
 */
export const manifestacaoSchema = manifestacaoBaseSchema.refine(
  (data) => {
    // Se for anônimo, identificação pode ser null
    if (data.anonimo) return true;
    // Se não for anônimo, identificação é obrigatória
    return data.identificacao !== null;
  },
  {
    message: "Identificação é obrigatória quando não for anônimo",
    path: ["identificacao"],
  }
);

/**
 * Schema para envio de manifestação (inclui anexos)
 */
export const envioManifestacaoSchema = manifestacaoBaseSchema.extend({
  anexos: z.array(anexoSchema).optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  regiaoAdministrativa: z.string().optional(),
}).refine(
  (data) => {
    if (data.anonimo) return true;
    return data.identificacao !== null;
  },
  {
    message: "Identificação é obrigatória quando não for anônimo",
    path: ["identificacao"],
  }
);

/**
 * Tipo inferido do schema de manifestação
 */
export type ManifestacaoInput = z.infer<typeof manifestacaoSchema>;
export type EnvioManifestacaoInput = z.infer<typeof envioManifestacaoSchema>;
export type IdentificacaoInput = z.infer<typeof identificacaoSchema>;
export type AssuntoInput = z.infer<typeof assuntoSchema>;

/**
 * Função helper para validar dados parciais
 */
export function validarParcial<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  dados: Partial<z.infer<T>>
): { valido: boolean; erros: Record<string, string> } {
  const resultado = schema.partial().safeParse(dados);

  if (resultado.success) {
    return { valido: true, erros: {} };
  }

  const erros: Record<string, string> = {};
  resultado.error.issues.forEach((issue) => {
    const campo = issue.path.join(".");
    erros[campo] = issue.message;
  });

  return { valido: false, erros };
}

/**
 * Valida se pode avançar para próxima etapa
 */
export function validarEtapa(
  etapa: number,
  dados: Partial<EnvioManifestacaoInput>
): { valido: boolean; mensagem?: string } {
  switch (etapa) {
    case 1: // Tipo
      if (!dados.tipo) {
        return { valido: false, mensagem: "Selecione o tipo de manifestação" };
      }
      return { valido: true };

    case 2: // Assunto
      if (!dados.assunto?.categoria) {
        return { valido: false, mensagem: "Selecione uma categoria" };
      }
      return { valido: true };

    case 3: // Relato
      const temRelato = dados.relato && dados.relato.length >= VALIDACOES.relato.minCaracteres;
      const temAnexo = dados.anexos && dados.anexos.length > 0;
      if (!temRelato && !temAnexo) {
        return {
          valido: false,
          mensagem: `Escreva pelo menos ${VALIDACOES.relato.minCaracteres} caracteres ou adicione um anexo`,
        };
      }
      return { valido: true };

    case 4: // Anexos
      return { valido: true }; // Opcional

    case 5: // Identificação
      if (!dados.anonimo && !dados.identificacao) {
        return { valido: false, mensagem: "Preencha seus dados de identificação" };
      }
      if (dados.identificacao) {
        const resultado = identificacaoSchema.safeParse(dados.identificacao);
        if (!resultado.success) {
          return { valido: false, mensagem: resultado.error.issues[0]?.message };
        }
      }
      return { valido: true };

    case 6: // Confirmação
      return { valido: true };

    default:
      return { valido: false, mensagem: "Etapa inválida" };
  }
}
