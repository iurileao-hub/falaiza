# Plano de Implementação: PWA Ouvidoria Participa DF

> **Data:** 20/01/2026
> **Prazo de entrega:** 30/01/2026 às 23h59
> **Categoria:** II - Ouvidoria
> **Prêmio:** R$ 8.000 (1º lugar)

---

## Sumário Executivo

### Objetivo
Desenvolver uma PWA acessível e inovadora para registro de manifestações cidadãs no Participa DF, com interface conversacional híbrida guiada pela assistente virtual IZA.

### Diferenciais Competitivos
1. **Wizard Conversacional** - Combina estrutura de etapas com tom humanizado
2. **Multicanalidade Simultânea** - Texto + áudio + foto + vídeo na mesma manifestação
3. **Gravação Nativa** - Captura de mídia direto no browser (não só upload)
4. **100% Offline** - PWA funcional sem conexão
5. **Acessibilidade Nativa** - WCAG 2.1 AA sem depender de plugins
6. **Identidade Visual Integrada** - Visual alinhado ao Participa DF existente
7. **IZA Inteligente com Privacidade** - Classificação automática de manifestações por IA
   - 3 camadas: Regras → Modelo Local → Backend GDF
   - Dados nunca saem do dispositivo (camadas 1 e 2)
   - Conformidade total com LGPD
   - Reduz tempo de registro de ~5 para ~3 minutos

---

## Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Framework | Next.js 14 (App Router) | SSR, PWA nativo, Server Actions |
| Estilização | Tailwind CSS + shadcn/ui | Acessibilidade built-in (Radix UI) |
| Estado | Zustand + React Context | Simples, leve, sem boilerplate |
| Persistência | IndexedDB (Dexie.js) | Suporta blobs grandes, offline |
| Mídia | MediaRecorder API (nativo) | Sem dependências, controle total |
| Validação | Zod | Type-safe, integra com forms |
| Testes A11y | axe-core + jest-axe | Automação de testes WCAG |
| PWA | next-pwa | Service Worker automático |
| IA Local | Transformers.js | Modelos ONNX no browser, privacidade total |

---

## Arquitetura de Pastas

```
hackathon-ouvidoria-df/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── apple-touch-icon.png
│   └── assets/
│       ├── iza/
│       │   ├── iza-default.png
│       │   ├── iza-lupa.png
│       │   ├── iza-sucesso.png
│       │   └── iza-erro.png
│       └── logos/
│           ├── gdf.png
│           ├── participa-df.png
│           └── ouvidoria.png
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── manifest.ts
│   │   │
│   │   ├── manifestacao/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── relato/
│   │   │   │   └── page.tsx        # Etapa 1: Relato (texto + mídia)
│   │   │   ├── sugestao/
│   │   │   │   └── page.tsx        # Etapa 2: Sugestão IA (NOVA)
│   │   │   ├── anexos/
│   │   │   │   └── page.tsx        # Etapa 3: Anexos adicionais
│   │   │   ├── identificacao/
│   │   │   │   └── page.tsx        # Etapa 4: Dados pessoais
│   │   │   └── confirmacao/
│   │   │       └── page.tsx        # Etapa 5: Protocolo
│   │   │
│   │   └── api/
│   │       ├── manifestacao/
│   │       │   └── route.ts
│   │       └── protocolo/
│   │           └── [id]/
│   │               └── route.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   └── progress.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SkipLinks.tsx
│   │   │   └── OfflineIndicator.tsx
│   │   │
│   │   ├── iza/
│   │   │   ├── IzaAvatar.tsx
│   │   │   ├── IzaMessage.tsx
│   │   │   ├── IzaContainer.tsx
│   │   │   ├── IzaCarregando.tsx
│   │   │   ├── IzaSugestaoInteligente.tsx
│   │   │   ├── SeletorComConfianca.tsx
│   │   │   ├── ConfiancaIndicator.tsx
│   │   │   ├── PrivacidadeIndicator.tsx
│   │   │   ├── ConsentimentoIA.tsx
│   │   │   └── IzaModelDownload.tsx
│   │   │
│   │   ├── wizard/
│   │   │   ├── WizardLayout.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StepIndicator.tsx
│   │   │   ├── StepCard.tsx
│   │   │   ├── NavigationButtons.tsx
│   │   │   └── StepTransition.tsx
│   │   │
│   │   ├── media/
│   │   │   ├── MediaToolbar.tsx
│   │   │   ├── AudioRecorder.tsx
│   │   │   ├── VideoRecorder.tsx
│   │   │   ├── PhotoCapture.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   ├── MediaPreview.tsx
│   │   │   ├── MediaList.tsx
│   │   │   └── WaveformVisualizer.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── IdentificacaoForm.tsx
│   │   │   ├── RelatoTextarea.tsx
│   │   │   ├── AssuntoSearch.tsx
│   │   │   └── FormError.tsx
│   │   │
│   │   └── accessibility/
│   │       ├── AccessibilityPanel.tsx
│   │       ├── HighContrastToggle.tsx
│   │       ├── FontSizeControl.tsx
│   │       ├── ReducedMotionToggle.tsx
│   │       └── ScreenReaderAnnouncer.tsx
│   │
│   ├── hooks/
│   │   ├── useManifestacao.ts
│   │   ├── useMediaRecorder.ts
│   │   ├── useAudioRecorder.ts
│   │   ├── useVideoRecorder.ts
│   │   ├── usePhotoCapture.ts
│   │   ├── useIndexedDB.ts
│   │   ├── useOffline.ts
│   │   ├── useAccessibility.ts
│   │   ├── useKeyboardNavigation.ts
│   │   ├── useClassificacao.ts
│   │   └── useModeloLocal.ts
│   │
│   ├── lib/
│   │   ├── db.ts
│   │   ├── protocolo.ts
│   │   ├── validations.ts
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   └── iza/
│   │       ├── engine.ts
│   │       ├── rules-engine.ts
│   │       ├── local-model.ts
│   │       ├── keywords.ts
│   │       └── types.ts
│   │
│   ├── stores/
│   │   ├── manifestacaoStore.ts
│   │   └── accessibilityStore.ts
│   │
│   ├── types/
│   │   ├── manifestacao.ts
│   │   ├── anexo.ts
│   │   └── accessibility.ts
│   │
│   └── styles/
│       ├── design-tokens.css
│       └── high-contrast.css
│
├── tests/
│   ├── a11y/
│   │   ├── wizard.test.tsx
│   │   └── forms.test.tsx
│   └── components/
│       └── media.test.tsx
│
├── docs/
│   ├── analise-participa-df.md
│   └── plans/
│       └── 2026-01-20-pwa-ouvidoria-design.md
│
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Design System

### Cores (CSS Variables)

```css
:root {
  /* Cores Primárias - Participa DF */
  --color-primary: #192D4B;
  --color-primary-dark: #0f1c2e;
  --color-primary-light: #28477D;

  /* Cores de Ação */
  --color-success: #549250;
  --color-success-dark: #3d7039;
  --color-error: #B91C1C;
  --color-warning: #D97706;
  --color-info: #0062AE;

  /* Cores Neutras */
  --color-text: #212529;
  --color-text-muted: #6B7280;
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-border: #E5E7EB;

  /* Cores GDF */
  --color-gdf-yellow: #FFC107;
  --color-gdf-green: #28A745;

  /* Foco e Acessibilidade */
  --color-focus: #0062AE;
  --color-focus-ring: rgba(0, 98, 174, 0.5);

  /* Espaçamento */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Tipografia */
  --font-family: 'Montserrat', 'Muli', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Alto Contraste */
[data-high-contrast="true"] {
  --color-primary: #000000;
  --color-text: #FFFFFF;
  --color-background: #000000;
  --color-surface: #1a1a1a;
  --color-border: #FFFFFF;
  --color-focus: #FFFF00;
  --color-success: #00FF00;
  --color-error: #FF6666;
  --color-info: #00FFFF;
}

/* Tamanhos de Fonte */
[data-font-size="large"] {
  --font-size-base: 1.125rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
}

[data-font-size="larger"] {
  --font-size-base: 1.25rem;
  --font-size-lg: 1.5rem;
  --font-size-xl: 1.75rem;
}
```

### Componentes Base

#### Botões
```
Primary:   bg-success, text-white, hover:bg-success-dark
Secondary: bg-primary, text-white, hover:bg-primary-dark
Outline:   border-primary, text-primary, hover:bg-primary/10
Ghost:     text-primary, hover:bg-primary/10
```

#### Cards de Seleção
```
Default:   border-border, bg-surface
Hover:     border-primary, shadow-md
Selected:  border-primary, bg-primary/5, ring-2 ring-primary
Focus:     ring-2 ring-focus, ring-offset-2
```

#### Inputs
```
Default:   border-border, focus:border-primary, focus:ring-2
Error:     border-error, focus:border-error
Disabled:  bg-surface, text-muted, cursor-not-allowed
```

---

## Fluxo do Wizard

### Mudança de Paradigma com IZA Inteligente

O fluxo foi redesenhado para ser mais natural e inteligente:

```
FLUXO ORIGINAL (6 etapas manuais):
Tipo → Assunto → Relato → Anexos → Identificação → Confirmação
 ↓        ↓
Manual  Manual

FLUXO COM IZA INTELIGENTE (5 etapas, classificação automática):
Relato → Sugestão IA → Anexos → Identificação → Confirmação
  ↓           ↓
Texto/    Automático
Mídia     (editável)
```

**Benefícios:**
- Cidadão começa contando o problema (mais natural)
- IA classifica tipo e órgão automaticamente
- Reduz carga cognitiva (menos decisões manuais)
- Tempo de registro: ~5min → ~3min

### Etapas (Novo Fluxo)

| # | Rota | Componente Principal | Validação |
|---|------|---------------------|-----------|
| 1 | `/manifestacao/relato` | RelatoTextarea + MediaToolbar | Mín. 20 chars OU 1 mídia |
| 2 | `/manifestacao/sugestao` | IzaSugestaoInteligente | Tipo e órgão confirmados |
| 3 | `/manifestacao/anexos` | MediaList + MediaToolbar | Opcional (máx 25MB) |
| 4 | `/manifestacao/identificacao` | IdentificacaoForm | Condicional por tipo |
| 5 | `/manifestacao/confirmacao` | Resumo + Protocolo | Revisão final |

### Regras de Navegação

```typescript
const REGRAS_NAVEGACAO = {
  // Pode avançar se:
  podeAvancar: (etapa: number, dados: Manifestacao) => {
    switch (etapa) {
      case 1: return dados.relato?.length >= 20 || dados.midias?.length > 0;
      case 2: return !!dados.classificacao?.tipo && !!dados.classificacao?.orgao;
      case 3: return true; // Anexos opcionais
      case 4: return dados.anonimo || validarIdentificacao(dados.identificacao);
      case 5: return true; // Confirmação
    }
  },

  // Pode voltar sempre (exceto etapa 1)
  podeVoltar: (etapa: number) => etapa > 1,

  // Anonimato disponível apenas para:
  permiteAnonimo: (tipo: string) => ['reclamacao', 'denuncia'].includes(tipo),
};
```

### Tipos de Manifestação

```typescript
const TIPOS_MANIFESTACAO = [
  {
    id: 'reclamacao',
    nome: 'Reclamação',
    icone: '😤',
    descricao: 'Algo não está funcionando bem',
    permiteAnonimo: true,
  },
  {
    id: 'denuncia',
    nome: 'Denúncia',
    icone: '🚨',
    descricao: 'Irregularidade ou má conduta',
    permiteAnonimo: true,
  },
  {
    id: 'sugestao',
    nome: 'Sugestão',
    icone: '💡',
    descricao: 'Ideia para melhorar',
    permiteAnonimo: false,
  },
  {
    id: 'elogio',
    nome: 'Elogio',
    icone: '⭐',
    descricao: 'Reconhecer um bom serviço',
    permiteAnonimo: false,
  },
  {
    id: 'solicitacao',
    nome: 'Solicitação',
    icone: '📋',
    descricao: 'Pedir um serviço',
    permiteAnonimo: false,
  },
  {
    id: 'informacao',
    nome: 'Informação',
    icone: '❓',
    descricao: 'Tirar uma dúvida',
    permiteAnonimo: false,
  },
];
```

### Categorias/Assuntos

```typescript
const CATEGORIAS = [
  { id: 'saude', nome: 'Saúde', icone: '🏥' },
  { id: 'educacao', nome: 'Educação', icone: '🎓' },
  { id: 'transporte', nome: 'Transporte', icone: '🚌' },
  { id: 'seguranca', nome: 'Segurança', icone: '🛡️' },
  { id: 'obras', nome: 'Obras', icone: '🏗️' },
  { id: 'saneamento', nome: 'Saneamento', icone: '💧' },
  { id: 'meio-ambiente', nome: 'Meio Ambiente', icone: '🌳' },
  { id: 'documentos', nome: 'Documentos', icone: '📄' },
  { id: 'assistencia-social', nome: 'Assistência Social', icone: '🤝' },
  { id: 'outro', nome: 'Outro', icone: '🏛️' },
];
```

---

## Captura de Mídia

### Configurações

```typescript
const MEDIA_CONFIG = {
  audio: {
    mimeType: 'audio/webm;codecs=opus',
    maxDuration: 5 * 60 * 1000, // 5 minutos
    maxSize: 10 * 1024 * 1024,  // 10 MB
  },
  video: {
    mimeType: 'video/webm;codecs=vp9',
    maxDuration: 2 * 60 * 1000, // 2 minutos
    maxSize: 15 * 1024 * 1024,  // 15 MB
    constraints: {
      video: { width: 1280, height: 720, facingMode: 'environment' },
      audio: true,
    },
  },
  photo: {
    mimeType: 'image/jpeg',
    maxSize: 5 * 1024 * 1024, // 5 MB
    quality: 0.85,
  },
  document: {
    accept: '.pdf,.doc,.docx,.xls,.xlsx',
    maxSize: 10 * 1024 * 1024, // 10 MB
  },
  totalMaxSize: 25 * 1024 * 1024, // 25 MB total
};
```

### Hook useMediaRecorder

```typescript
interface UseMediaRecorderOptions {
  type: 'audio' | 'video';
  onDataAvailable?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}

interface UseMediaRecorderReturn {
  status: 'idle' | 'requesting' | 'ready' | 'recording' | 'paused' | 'stopped';
  duration: number;
  blob: Blob | null;
  error: Error | null;
  stream: MediaStream | null;

  requestPermission: () => Promise<void>;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}
```

---

## Persistência (IndexedDB)

### Schema Dexie.js

```typescript
// lib/db.ts
import Dexie, { Table } from 'dexie';

interface Manifestacao {
  id?: number;
  status: 'rascunho' | 'pendente' | 'enviada' | 'erro';
  etapaAtual: number;
  tipo: string;
  assunto: {
    categoria: string;
    subcategoria?: string;
    descricao?: string;
  };
  relato: string;
  anonimo: boolean;
  identificacao?: {
    nome: string;
    cpf: string;
    email: string;
    telefone?: string;
    notificacoes: boolean;
  };
  protocolo?: string;
  criadoEm: Date;
  atualizadoEm: Date;
  enviadoEm?: Date;
}

interface Anexo {
  id?: number;
  manifestacaoId: number;
  tipo: 'audio' | 'video' | 'foto' | 'documento';
  nome: string;
  mimeType: string;
  tamanho: number;
  duracao?: number;
  blob: Blob;
  thumbnail?: Blob;
  criadoEm: Date;
}

interface Configuracao {
  id: string;
  valor: any;
}

class OuvidoriaDB extends Dexie {
  manifestacoes!: Table<Manifestacao>;
  anexos!: Table<Anexo>;
  configuracoes!: Table<Configuracao>;

  constructor() {
    super('ouvidoria-df');
    this.version(1).stores({
      manifestacoes: '++id, status, criadoEm',
      anexos: '++id, manifestacaoId, tipo',
      configuracoes: 'id',
    });
  }
}

export const db = new OuvidoriaDB();
```

---

## API Mock

### POST /api/manifestacao

```typescript
// app/api/manifestacao/route.ts
export async function POST(request: Request) {
  const data = await request.json();

  // Validar dados
  const validated = ManifestacaoSchema.parse(data);

  // Gerar protocolo
  const protocolo = gerarProtocolo(); // 2026.0120.00001234

  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1500));

  return Response.json({
    success: true,
    protocolo,
    mensagem: 'Manifestação registrada com sucesso',
    prazoResposta: '30 dias úteis',
  });
}
```

### Geração de Protocolo

```typescript
// lib/protocolo.ts
export function gerarProtocolo(): string {
  const ano = new Date().getFullYear();
  const mes = String(new Date().getMonth() + 1).padStart(2, '0');
  const dia = String(new Date().getDate()).padStart(2, '0');
  const sequencial = String(Math.floor(Math.random() * 99999999)).padStart(8, '0');

  return `${ano}.${mes}${dia}.${sequencial}`;
}
```

---

## PWA Configuration

### next.config.js

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /^https:\/\/www\.participa\.df\.gov\.br\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

module.exports = withPWA({
  reactStrictMode: true,
});
```

### manifest.json

```json
{
  "name": "Ouvidoria DF - Participa DF",
  "short_name": "Ouvidoria DF",
  "description": "Registre sua manifestação para a Ouvidoria do Governo do Distrito Federal",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#192D4B",
  "theme_color": "#192D4B",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["government", "utilities"],
  "lang": "pt-BR",
  "dir": "ltr"
}
```

---

## Acessibilidade - Checklist

### WCAG 2.1 AA Obrigatórios

- [ ] **1.1.1** Texto alternativo para imagens
- [ ] **1.3.1** Informações e relações (estrutura semântica)
- [ ] **1.3.2** Sequência significativa
- [ ] **1.4.1** Uso de cor (não depender só de cor)
- [ ] **1.4.3** Contraste mínimo (4.5:1)
- [ ] **1.4.4** Redimensionar texto (até 200%)
- [ ] **1.4.10** Refluxo (responsivo sem scroll horizontal)
- [ ] **1.4.11** Contraste de elementos não-texto (3:1)
- [ ] **2.1.1** Teclado (todas funções acessíveis)
- [ ] **2.1.2** Sem bloqueio de teclado
- [ ] **2.4.1** Ignorar blocos (skip links)
- [ ] **2.4.2** Título da página
- [ ] **2.4.3** Ordem de foco
- [ ] **2.4.4** Finalidade do link
- [ ] **2.4.6** Cabeçalhos e rótulos
- [ ] **2.4.7** Foco visível
- [ ] **2.5.3** Rótulo no nome (labels)
- [ ] **3.1.1** Idioma da página
- [ ] **3.2.1** Em foco (sem mudança de contexto)
- [ ] **3.2.2** Em entrada (sem mudança automática)
- [ ] **3.3.1** Identificação de erro
- [ ] **3.3.2** Rótulos ou instruções
- [ ] **4.1.1** Análise (HTML válido)
- [ ] **4.1.2** Nome, função, valor (ARIA)

### Testes Obrigatórios

1. **Navegação completa por teclado** (Tab, Enter, Espaço, Arrows)
2. **Leitor de tela** (VoiceOver no Mac)
3. **Modo alto contraste**
4. **Zoom 200%**
5. **axe-core** (0 violações críticas)
6. **Lighthouse** (Accessibility ≥ 95)

---

## Persona IZA - Mensagens

### Banco de Mensagens por Etapa

```typescript
const MENSAGENS_IZA = {
  etapa1: {
    inicial: "Olá! Sou a IZA, assistente da Ouvidoria do Distrito Federal. Como posso te ajudar hoje?",
    selecao: (tipo: string) => `Entendi! Você quer fazer ${artigoTipo(tipo)} ${tipo}.`,
  },

  etapa2: {
    inicial: (tipo: string) => `Certo! Agora me diz: sua ${tipo} é sobre qual área?`,
    selecao: (categoria: string) => `Ótimo, vou registrar como ${categoria}.`,
    busca: "Digite para buscar ou escolha uma das opções abaixo.",
  },

  etapa3: {
    inicial: "Conta pra mim o que aconteceu. Você pode escrever, gravar áudio, tirar foto ou gravar vídeo. Use quantos formatos quiser!",
    dicaAudio: "Dica: gravando em áudio fica mais fácil explicar detalhes!",
    dicaFoto: "Fotos ajudam muito a entender o problema.",
    minimo: "Escreva pelo menos 20 caracteres ou adicione uma mídia.",
  },

  etapa4: {
    inicial: "Quer adicionar mais algum arquivo? Documentos, fotos ou vídeos que ajudem a resolver sua demanda.",
    limite: (usado: number, total: number) => `Você usou ${usado} MB de ${total} MB disponíveis.`,
    vazio: "Não tem problema se não quiser anexar nada. Podemos continuar!",
  },

  etapa5: {
    inicial: "Estamos quase lá! Agora preciso saber: você quer se identificar ou prefere enviar de forma anônima?",
    identificado: "Ótimo! Preenche seus dados aqui. Eles são protegidos pela LGPD.",
    anonimo: "Tudo bem! Lembre-se que sem identificação você não poderá acompanhar a resposta.",
    obrigatorio: (tipo: string) => `Para ${tipo}, a identificação é obrigatória para que possamos te responder.`,
  },

  etapa6: {
    inicial: "Vamos revisar tudo antes de enviar? Confere se está tudo certo:",
    enviando: "Aguarde, estou enviando sua manifestação...",
    sucesso: "🎉 Manifestação enviada com sucesso!",
    erro: "Ops! Algo deu errado. Mas não se preocupe, seus dados estão salvos. Tente novamente.",
  },

  offline: {
    aviso: "Você está sem conexão. Não se preocupe! Seus dados estão salvos e serão enviados quando você voltar a ficar online.",
    sincronizando: "Conectado! Sincronizando seus dados...",
  },

  ajuda: {
    central162: "Se você não conseguir fazer o registro, ligue na Central 162.",
  },

  // Mensagens da IZA Inteligente (NOVAS)
  ia: {
    analisando: "Analisando seu relato...",
    altaConfianca: (tipo: string) =>
      `Entendi! Parece que você quer fazer ${artigoTipo(tipo)} ${tipo}. Confirma pra mim se está certo:`,
    mediaConfianca:
      "Acho que entendi, mas quero confirmar com você. É isso mesmo?",
    baixaConfianca:
      "Não consegui identificar bem o tipo. Você pode me ajudar escolhendo abaixo?",
    semModelo:
      "Identifiquei algumas informações no seu relato. Confere se está certo:",
    usuarioEditou:
      "Perfeito! Atualizei com as suas correções.",
    confirmado:
      "Ótimo! Vamos continuar com o registro.",
  },
};
```

---

## IZA Inteligente - Arquitetura de Privacidade

### Visão Geral

A IZA Inteligente usa IA para classificar automaticamente manifestações, extrair entidades e gerar resumos. A arquitetura foi projetada com **privacidade como prioridade**, garantindo que os dados do cidadão sejam protegidos.

```
┌─────────────────────────────────────────────────────────────────┐
│                    DISPOSITIVO DO CIDADÃO                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      PWA Ouvidoria                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │   Relato    │→ │ IZA Engine  │→ │   Sugestões     │   │  │
│  │  │  (texto)    │  │  (local)    │  │  (tipo, órgão)  │   │  │
│  │  └─────────────┘  └──────┬──────┘  └─────────────────┘   │  │
│  │                          │                                │  │
│  │         ┌────────────────┼────────────────┐              │  │
│  │         ▼                ▼                ▼              │  │
│  │  ┌──────────┐    ┌──────────────┐   ┌──────────┐        │  │
│  │  │ Camada 1 │    │   Camada 2   │   │ Camada 3 │        │  │
│  │  │  Regras  │    │ Modelo Local │   │ Backend  │        │  │
│  │  │  (0 KB)  │    │  (~50-80MB)  │   │   GDF    │        │  │
│  │  └──────────┘    └──────────────┘   └────┬─────┘        │  │
│  │       ✓               ✓ opcional         │ futuro       │  │
│  └───────────────────────────────────────────┼───────────────┘  │
│                 DADOS NUNCA SAEM             │                  │
│                 (exceto envio final)         │                  │
└─────────────────────────────────────────────────────────────────┘
                                               │
                                               ▼ (apenas Camada 3)
                              ┌────────────────────────────────┐
                              │     INFRAESTRUTURA GDF         │
                              │  (servidores públicos, LGPD)   │
                              └────────────────────────────────┘
```

### Princípio Fundamental

**Os dados do cidadão NUNCA são enviados para serviços externos de IA.**

A análise acontece:
- **Localmente no dispositivo** (Camadas 1 e 2), ou
- **Em servidores do próprio GDF** (Camada 3), sob LGPD

### Camada 1: Sistema de Regras (Sempre Disponível)

Classificação instantânea, offline, sem download adicional. Funciona em **qualquer dispositivo**.

```typescript
// lib/iza/rules-engine.ts

interface ClassificacaoResultado {
  tipo: { id: string; confianca: number };
  orgao: { id: string; confianca: number };
  entidades: {
    locais: string[];
    datas: string[];
    orgaosMencionados: string[];
  };
  resumo: string;
}

// Mapa de palavras-chave → classificação
const REGRAS_TIPO = {
  reclamacao: {
    peso: 1.0,
    palavras: ['reclamação', 'reclamar', 'péssimo', 'horrível', 'demora',
               'não funciona', 'quebrado', 'falta de', 'descaso', 'absurdo'],
    frases: ['esperei muito', 'não resolveram', 'ninguém atende']
  },
  denuncia: {
    peso: 1.2,
    palavras: ['denúncia', 'denunciar', 'corrupção', 'irregularidade',
               'desvio', 'fraude', 'ilegal', 'propina', 'assédio'],
    frases: ['vi funcionário', 'presenciei', 'tenho provas']
  },
  // ... elogio, sugestao, solicitacao, informacao
};

const REGRAS_ORGAO = {
  saude: {
    palavras: ['hospital', 'upa', 'posto de saúde', 'médico', 'enfermeiro',
               'remédio', 'medicamento', 'vacina', 'exame', 'cirurgia'],
    entidades: ['HRT', 'HRG', 'HRAN', 'UPA', 'UBS']
  },
  educacao: {
    palavras: ['escola', 'professor', 'aluno', 'matrícula', 'creche',
               'merenda', 'uniforme', 'transporte escolar'],
    entidades: ['CEF', 'CED', 'EC', 'CEI']
  },
  // ... transporte, seguranca, obras, saneamento, etc.
};

// Extração de entidades via Regex
const EXTRATORES = {
  locais: /\b(Taguatinga|Ceilândia|Samambaia|Plano Piloto|Águas Claras|...)\b/gi,
  datas: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|ontem|hoje|semana passada)\b/gi,
  orgaos: /\b(Hospital Regional de \w+|UPA \w+|Escola \w+|DETRAN|CAESB|CEB)\b/gi
};
```

**Performance:**
| Métrica | Valor |
|---------|-------|
| Tempo de classificação | < 50ms |
| Tamanho adicional | 0 KB |
| Precisão estimada | ~70-80% |
| Funciona offline | ✅ Sim |

### Camada 2: Modelo Local (Opcional, ~50-80MB)

Melhora precisão quando o usuário opta por baixar. **Dados continuam 100% no dispositivo.**

```typescript
// lib/iza/local-model.ts
import { pipeline, env } from '@xenova/transformers';

class IzaLocalModel {
  private embedder: any = null;

  async inicializar(onProgress?: (p: number) => void): Promise<void> {
    this.embedder = await pipeline(
      'feature-extraction',
      'Xenova/multilingual-e5-small',
      { progress_callback: onProgress, quantized: true }
    );
    await this.computarExemplos();
  }

  async classificar(relato: string): Promise<ClassificacaoResultado> {
    const embedding = await this.gerarEmbedding(relato);
    // Classificação por similaridade com exemplos pré-definidos
    return this.encontrarMaisSimilar(embedding);
  }
}
```

**Performance:**
| Métrica | Valor |
|---------|-------|
| Download inicial | ~50MB (uma vez) |
| Tempo de classificação | ~200-500ms |
| Precisão estimada | ~85-90% |
| Funciona offline | ✅ Sim (após download) |

### Camada 3: Backend GDF (Documentação para Implementação Futura)

Para casos onde maior precisão é necessária, documentamos a integração com infraestrutura do GDF.

```typescript
// Especificação da API (implementação futura pelo GDF)

/**
 * POST /api/ia/classificar
 * Dados processados e descartados - não persistidos.
 */
interface ClassificarRequest {
  relato: string;
  privacidade: {
    consentimento: true;
    naoArmazenar: true;
  };
}

interface ClassificarResponse {
  tipo: { id: string; confianca: number };
  orgao: { id: string; confianca: number };
  entidades: { locais: string[]; datas: string[] };
  resumo: { curto: string; medio: string };
  meta: {
    dadosDescartados: true;  // Confirmação LGPD
  };
}
```

**Requisitos de Segurança:**
- Isolamento de rede (serviço interno)
- TLS 1.3 obrigatório
- Dados descartados após processamento
- Logs anonimizados
- Consentimento explícito do usuário

### Matriz de Privacidade

| Aspecto | Camada 1 (Regras) | Camada 2 (Local) | Camada 3 (GDF) |
|---------|-------------------|------------------|----------------|
| Dados saem do device? | NÃO | NÃO | SIM (só p/ GDF) |
| Dados persistidos? | NÃO | NÃO | NÃO |
| Terceiros envolvidos? | NÃO | NÃO | NÃO |
| Consentimento | Implícito | Explícito | Explícito |
| Risco LGPD | ZERO | ZERO | BAIXO |

### Fluxo de Consentimento

```typescript
// components/iza/ConsentimentoIA.tsx

function ConsentimentoIA({ camada, onAceitar, onRecusar }) {
  return (
    <Card>
      <IzaMessage>
        {camada === 'modelo_local'
          ? "Quer que eu entenda melhor seu relato? Posso baixar um modelo de IA que funciona direto no seu celular."
          : "Para uma análise mais precisa, posso enviar seu relato para o servidor seguro da Ouvidoria do GDF."
        }
      </IzaMessage>

      <PrivacidadeInfo>
        {camada === 'modelo_local' ? (
          <>
            ✓ Seus dados NUNCA saem do seu celular
            ✓ Funciona mesmo sem internet
            ✓ Tamanho: ~50 MB (download único)
          </>
        ) : (
          <>
            ✓ Dados enviados apenas para servidores do GDF
            ✓ Processamento instantâneo, sem armazenamento
            ✓ Protegido pela LGPD
          </>
        )}
      </PrivacidadeInfo>

      <Button onClick={onAceitar}>Aceitar</Button>
      <Button variant="ghost" onClick={onRecusar}>Não, obrigado</Button>
    </Card>
  );
}
```

### Política de Privacidade (Resumo)

1. **Processamento Local (Padrão):** Dados nunca saem do dispositivo
2. **Servidor GDF (Opcional):** Dados apenas para servidores públicos, descartados após uso
3. **O que NÃO fazemos:**
   - ❌ Não usamos APIs de IA comerciais (OpenAI, Google, etc.)
   - ❌ Não vendemos ou compartilhamos dados
   - ❌ Não armazenamos relatos para treinar modelos
4. **Direitos LGPD:** Acesso, exclusão, revogação de consentimento

---

## Sequência de Implementação

### Fase 1: Setup (2h)
1. Criar projeto Next.js com TypeScript
2. Configurar Tailwind + shadcn/ui
3. Instalar dependências (Dexie, Zod, next-pwa)
4. Configurar estrutura de pastas
5. Adicionar fontes (Montserrat)
6. Criar design tokens CSS

### Fase 2: Layout Base (2h)
1. Header com logos
2. Footer com links
3. Skip links
4. Layout do wizard
5. Progress bar
6. Navigation buttons

### Fase 3: Componentes IZA (1h)
1. IzaAvatar (variações)
2. IzaMessage (balão)
3. IzaContainer (composição)

### Fase 4: Etapa 1 - Relato (2h)
1. Página relato (textarea + media toolbar)
2. Integração com captura de mídia
3. Validação (mín 20 chars OU mídia)
4. Auto-save do rascunho

### Fase 5: Captura de Mídia (3h)
1. useMediaRecorder hook
2. AudioRecorder
3. VideoRecorder
4. PhotoCapture
5. FileUploader
6. MediaList + preview

### Fase 6: IZA Inteligente (3h) - NOVA
1. Engine de classificação por regras (rules-engine.ts)
2. Mapeamento de palavras-chave (tipos + órgãos)
3. Extração de entidades (regex para locais, datas)
4. Componentes de sugestão (IzaSugestaoInteligente, SeletorComConfianca)
5. Integração Transformers.js (modelo local opcional)
6. Tela de consentimento e download do modelo
7. Indicadores de privacidade e confiança
8. Página /manifestacao/sugestao

### Fase 7: Etapas 3-5 (2h)
1. Página anexos (lista + upload adicional)
2. Página identificação (form + toggle anônimo)
3. Página confirmação (resumo + protocolo)
4. Tela de sucesso

### Fase 8: Persistência (2h)
1. Configurar Dexie.js
2. Hook useManifestacao
3. Auto-save entre etapas
4. Recuperação de rascunhos

### Fase 9: PWA + Offline (2h)
1. Configurar next-pwa
2. manifest.json
3. Service Worker
4. Indicador offline
5. Fila de sincronização

### Fase 10: Acessibilidade (2h)
1. Skip links funcionais
2. ARIA labels em todos componentes
3. Navegação por teclado
4. Painel de acessibilidade
5. Alto contraste

### Fase 11: Testes + Polish (2h)
1. Testes axe-core
2. Teste manual VoiceOver
3. Lighthouse audit
4. Ajustes finais de UI
5. Responsividade mobile

### Fase 12: Documentação (1h)
1. README.md completo
2. Instruções de instalação
3. Decisões técnicas
4. Gravar vídeo (7 min)

---

## Estimativa Total

| Fase | Descrição | Tempo |
|------|-----------|-------|
| 1-3 | Setup + Layout + IZA visual | 5h |
| 4-5 | Relato + Captura de Mídia | 5h |
| 6 | **IZA Inteligente (NOVA)** | 3h |
| 7 | Etapas 3-5 (anexos, id, confirmação) | 2h |
| 8-9 | Persistência + PWA | 4h |
| 10-11 | Acessibilidade + Testes | 4h |
| 12 | Documentação + Vídeo | 1h |
| **Total** | | **~24h** |

---

## Critérios de Aceite Final

### P1: Critérios de Entrega (10 pts)

| Critério | Meta | Como atingir |
|----------|------|--------------|
| Acessibilidade WCAG 2.1 AA (2.5) | 2.5/2.5 | Checklist completo + Lighthouse ≥95 |
| Multicanalidade (3.0) | 3.0/3.0 | Texto + áudio + vídeo + foto simultâneos |
| UX/UI (3.0) | 3.0/3.0 | Wizard conversacional + IZA Inteligente + visual Participa DF |
| Integração Participa DF (1.5) | 1.5/1.5 | Cores, fontes, IZA, fluxo otimizado |

### Diferencial Competitivo: IZA Inteligente

| Funcionalidade | Benefício | Implementação |
|----------------|-----------|---------------|
| Classificação automática | Menos cliques, mais natural | Regras + Modelo Local |
| Extração de entidades | Formulário pré-preenchido | Regex + NLP |
| Privacidade by design | Dados no dispositivo | Camadas 1 e 2 locais |
| LGPD compliance | Confiança do cidadão | Consentimento explícito |

### P2: Documentação (10 pts)

| Critério | Meta | Como atingir |
|----------|------|--------------|
| Qualidade do Código (4.0) | 4.0/4.0 | TypeScript strict, componentes organizados |
| Lógica e Funcionamento (3.0) | 3.0/3.0 | Fluxo completo funcional |
| README com instruções (1.0) | 1.0/1.0 | Setup claro, tecnologias listadas |
| Vídeo demonstrativo (1.0) | 1.0/1.0 | 7 min mostrando tudo |
| Clareza e Organização (1.0) | 1.0/1.0 | Estrutura de pastas lógica |

**Meta: 20/20 pontos**

---

## Checklist Pré-Submissão

- [ ] Repositório público no GitHub
- [ ] README.md com instruções de instalação
- [ ] Link do vídeo no README
- [ ] Código rodando sem erros
- [ ] PWA instalável
- [ ] Funciona offline
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Navegação 100% por teclado
- [ ] Testado com VoiceOver
- [ ] Vídeo gravado (≤ 7 min)
- [ ] Formulário de inscrição preenchido

### IZA Inteligente
- [ ] Classificação por regras funcionando
- [ ] Extração de entidades (locais, datas)
- [ ] Tela de sugestão com edição
- [ ] Indicadores de confiança
- [ ] Indicadores de privacidade
- [ ] Modelo local opcional (Transformers.js)
- [ ] Documentação de privacidade/LGPD
