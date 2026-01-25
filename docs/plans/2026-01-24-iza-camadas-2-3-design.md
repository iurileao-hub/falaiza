# Design: IZA Inteligente - Camadas 2 e 3

**Data:** 2026-01-24
**Status:** Implementado

> **Documento relacionado:** Para especificação técnica completa do Backend GDF (Camada 3), incluindo modelos recomendados, arquiteturas e configurações, consulte [backend-gdf-especificacao.md](./2026-01-24-backend-gdf-especificacao.md).

## Decisões do Brainstorming

### Camada 2: Modelo Local

| Aspecto | Decisão |
|---------|---------|
| **Biblioteca** | `@xenova/transformers` |
| **Modelo** | `Xenova/mobilebert-uncased-mnli` (~100MB) |
| **Abordagem** | Zero-shot classification |
| **Download** | Sob demanda com prompt + aviso de WiFi |
| **Cache** | IndexedDB via Transformers.js |

### Camada 3: Backend GDF

| Aspecto | Decisão |
|---------|---------|
| **Implementação** | Mock local para demonstração |
| **Rota** | `/api/ia/classificar` |
| **Consentimento** | Não necessário (implícito em ouvidoria) |
| **Indicador** | Badge de sigilo dos dados |

## Arquitetura de Classificação

```
┌─────────────────────────────────────────────────────────────┐
│              FLUXO DE CLASSIFICAÇÃO                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Usuário digita relato                                      │
│         ↓                                                   │
│  ┌─────────────────┐                                        │
│  │   CAMADA 1      │  ← Sempre executa (< 50ms)             │
│  │   Regras        │  ← Resultado imediato                  │
│  └────────┬────────┘                                        │
│           ↓                                                 │
│  ┌─────────────────┐                                        │
│  │   CAMADA 2      │  ← Se modelo baixado                   │
│  │   MobileBERT    │  ← Zero-shot (~500ms)                  │
│  │   (100MB)       │  ← 100% local                          │
│  └────────┬────────┘                                        │
│           ↓                                                 │
│  ┌─────────────────┐                                        │
│  │   CAMADA 3      │  ← Se online + confiança baixa         │
│  │   Backend GDF   │  ← API POST (~1-2s)                    │
│  │   (Mock)        │  ← Indicador de sigilo                 │
│  └─────────────────┘                                        │
│                                                             │
│  Resultado: melhor classificação disponível                 │
└─────────────────────────────────────────────────────────────┘
```

## Regras de Fallback

- **Camada 1** sempre retorna resultado (baseline)
- **Camada 2** só usa se confiança > 0.6
- **Camada 3** só usa se online e Camadas 1+2 tiverem confiança < 0.5

## Arquivos a Criar/Modificar

### Novos Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/iza/model-local.ts` | Manager do modelo MobileBERT |
| `src/components/iza/ModeloLocalDownload.tsx` | UI de download com progresso |
| `src/app/api/ia/classificar/route.ts` | Mock do backend GDF |

### Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `src/lib/iza/engine.ts` | Integrar Camada 2 real |
| `src/lib/iza/types.ts` | Novos tipos para ML |
| `src/components/iza/IzaSugestaoInteligente.tsx` | Oferta de download |

## Zero-Shot Classification

Labels passados em tempo de execução:

```typescript
const LABELS_TIPO = [
  'reclamação sobre serviço público',
  'denúncia de irregularidade ou corrupção',
  'elogio a servidor ou serviço público',
  'sugestão de melhoria',
  'solicitação de serviço ou atendimento',
  'pedido de informação'
];

const LABELS_ORGAO = [
  'saúde e hospitais',
  'educação e escolas',
  'transporte e trânsito',
  'segurança pública',
  'obras e infraestrutura',
  'saneamento e água',
  'meio ambiente',
  'documentos e cartórios',
  'assistência social',
  'outros assuntos'
];
```

## Fluxo de Download do Modelo

1. Usuário vê resultado da Camada 1
2. Se confiança < 0.7, IZA oferece download
3. Mensagem: "Quer que eu baixe um modelo de IA para classificações mais precisas? (~100MB, recomendo usar WiFi)"
4. Botão "Baixar modelo" inicia download
5. Barra de progresso durante download
6. Modelo fica em cache para próximas visitas

## API Mock - Backend GDF

```typescript
// POST /api/ia/classificar
// Request
{
  relato: string
}

// Response
{
  tipo: { id: string, confianca: number },
  orgao: { id: string, confianca: number },
  resumo: string,
  meta: {
    fonte: 'backend_gdf',
    tempoProcessamento: number,
    sigiloso: true
  }
}
```

## Indicadores na UI

| Camada | Badge |
|--------|-------|
| Camada 1 | "Processado localmente" |
| Camada 2 | "IA local - seus dados não saem do dispositivo" |
| Camada 3 | "Processado pelo GDF - dados sigilosos" |
