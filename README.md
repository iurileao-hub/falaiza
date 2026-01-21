# PWA Ouvidoria DF - Participa DF

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> **1º Hackathon em Controle Social: Desafio Participa DF**
> Categoria II - Ouvidoria | Prêmio: R$ 8.000,00

<p align="center">
  <img src="public/assets/logos/Logo-OUV.svg" alt="Logo Ouvidoria DF" width="300">
</p>

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Uso](#uso)
- [Acessibilidade](#acessibilidade)
- [PWA e Offline](#pwa-e-offline)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API](#api)
- [Testes](#testes)
- [Critérios de Avaliação](#critérios-de-avaliação)
- [Uso de IA](#uso-de-ia-no-desenvolvimento)
- [Licença](#licença)

---

## Sobre o Projeto

A **PWA Ouvidoria DF** é uma aplicação web progressiva desenvolvida para o **1º Hackathon em Controle Social: Desafio Participa DF**, focada em modernizar e facilitar o registro de manifestações cidadãs para a Ouvidoria do Governo do Distrito Federal.

### Problema

O sistema atual de ouvidoria apresenta barreiras significativas:
- Interface complexa e pouco intuitiva
- Falta de suporte adequado para dispositivos móveis
- Ausência de recursos de acessibilidade adequados
- Impossibilidade de registro offline
- Limitação nos formatos de manifestação (apenas texto)

### Solução

Nossa solução oferece:
- **Interface conversacional guiada** pela assistente virtual IZA
- **Multicanalidade simultânea**: texto, áudio, vídeo e fotos
- **Captura nativa** de mídia (gravação direta no navegador)
- **Funcionamento 100% offline** com sincronização automática
- **Conformidade WCAG 2.1 AA** para máxima acessibilidade
- **PWA instalável** em qualquer dispositivo

---

## Funcionalidades

### Tipos de Manifestação

| Tipo | Descrição | Anonimato |
|------|-----------|-----------|
| Reclamação | Expressão de insatisfação com serviço público | Permitido |
| Denúncia | Relato de irregularidade ou ilegalidade | Permitido |
| Sugestão | Proposta de melhoria para serviço público | Não permitido |
| Elogio | Reconhecimento de atendimento ou serviço | Não permitido |
| Solicitação | Pedido de atendimento ou providência | Não permitido |
| Informação | Pedido de dados ou esclarecimentos | Não permitido |

### Wizard Conversacional (6 Etapas)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. Tipo    │────▶│  2. Assunto │────▶│  3. Relato  │
│             │     │             │     │ Texto+Mídia │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│6.Confirmação│◀────│5.Identificar│◀────│  4. Anexos  │
│  Protocolo  │     │  ou Anônimo │     │  Opcionais  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Captura de Mídia

- **Áudio**: Gravação até 5 minutos (10 MB max)
- **Vídeo**: Gravação até 2 minutos (15 MB max)
- **Fotos**: Captura direta pela câmera (5 MB max)
- **Documentos**: Upload de PDF, DOC, imagens (10 MB max)
- **Total**: Até 25 MB por manifestação

### Assistente Virtual IZA

A IZA guia o cidadão durante todo o processo com:
- Mensagens contextuais em cada etapa
- Tom amigável e acolhedor
- Variações visuais (default, sucesso, erro)
- Dicas e orientações personalizadas

---

## Tecnologias

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| **Framework** | Next.js (App Router) | 14.2.x |
| **Linguagem** | TypeScript | 5.x |
| **Estilização** | Tailwind CSS | 3.4.x |
| **Componentes** | shadcn/ui (Radix UI) | latest |
| **Estado** | Zustand | 5.x |
| **Persistência** | Dexie.js (IndexedDB) | 4.x |
| **Validação** | Zod | 3.x |
| **PWA** | Serwist | 9.x |
| **Acessibilidade** | axe-core | latest |

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Camada de Apresentação                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Páginas   │  │ Componentes │  │   Design System     │  │
│  │  (Next.js)  │  │   (React)   │  │  (Tailwind+Radix)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      Camada de Negócio                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Zustand   │  │   Hooks     │  │    Validações       │  │
│  │   (Store)   │  │ Customizados│  │      (Zod)          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                       Camada de Dados                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  IndexedDB  │  │  API Routes │  │   Service Worker    │  │
│  │  (Dexie.js) │  │  (Next.js)  │  │     (Serwist)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Instalação

### Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior

### Passos

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/hackathon-ouvidoria-df.git
cd hackathon-ouvidoria-df

# Instalar dependências
npm install

# Gerar ícones PWA (opcional, já incluídos)
node scripts/generate-icons.js

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build de Produção

```bash
# Gerar build otimizado
npm run build

# Iniciar servidor de produção
npm start
```

---

## Uso

### Fluxo do Cidadão

1. **Página Inicial**: Escolha entre "Ouvidoria" ou "Acompanhar"
2. **Tipo**: Selecione o tipo de manifestação desejada
3. **Assunto**: Busque e selecione a categoria do problema
4. **Relato**: Descreva a situação usando texto, áudio, vídeo ou fotos
5. **Anexos**: Adicione documentos complementares (opcional)
6. **Identificação**: Informe seus dados ou envie anonimamente
7. **Confirmação**: Revise e receba seu protocolo

### Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Alt + A` | Abrir painel de acessibilidade |
| `Tab` | Navegar entre elementos |
| `Enter/Space` | Ativar elemento selecionado |
| `Escape` | Fechar diálogos/painéis |

---

## Acessibilidade

Este projeto segue as diretrizes **WCAG 2.1 nível AA**, garantindo:

### Recursos Implementados

- **Contraste**: Mínimo 4.5:1 para texto normal
- **Navegação por Teclado**: 100% navegável sem mouse
- **Skip Links**: Atalhos para conteúdo principal
- **ARIA Labels**: Em todos os elementos interativos
- **Landmarks**: Estrutura semântica (header, main, nav, footer)
- **Live Regions**: Anúncios para leitores de tela
- **Foco Visível**: Indicadores claros de foco
- **Redimensionamento**: Suporte até 200% sem perda de conteúdo

### Painel de Acessibilidade (`Alt + A`)

- Alto contraste (modo escuro acessível)
- Ajuste de tamanho de fonte (75% - 200%)
- Redução de animações
- Espaçamento de linhas aumentado
- Destaque de links

### Verificação Automática

O projeto inclui **axe-core** para verificação automática de acessibilidade em desenvolvimento.

---

## PWA e Offline

### Características PWA

- **Instalável**: Adicione à tela inicial em qualquer dispositivo
- **Offline First**: Funciona sem conexão com internet
- **Service Worker**: Cache inteligente de recursos
- **Manifest**: Configuração completa de app

### Funcionamento Offline

1. **Rascunhos Locais**: Manifestações salvas no IndexedDB
2. **Fila de Sincronização**: Envio automático quando online
3. **Página Offline**: Feedback visual quando sem conexão
4. **Indicador de Status**: Notificação de estado de conexão

### Ícones e Splash

Ícones PWA gerados automaticamente em todos os tamanhos:
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512
- Apple Touch Icon (180x180)

---

## Estrutura do Projeto

```
hackathon-ouvidoria-df/
├── public/
│   ├── assets/
│   │   ├── iza/              # Avatares da assistente IZA
│   │   └── logos/            # Logos GDF, Participa DF
│   ├── icons/                # Ícones PWA
│   └── manifest.json         # Manifest PWA
│
├── src/
│   ├── app/                  # App Router (Next.js 14)
│   │   ├── layout.tsx        # Layout raiz
│   │   ├── page.tsx          # Página inicial
│   │   ├── globals.css       # Estilos globais
│   │   ├── sw.ts             # Service Worker
│   │   ├── offline/          # Página offline
│   │   ├── manifestacao/     # Wizard de manifestação
│   │   │   ├── tipo/
│   │   │   ├── assunto/
│   │   │   ├── relato/
│   │   │   ├── anexos/
│   │   │   ├── identificacao/
│   │   │   └── confirmacao/
│   │   └── api/
│   │       └── manifestacao/ # API route
│   │
│   ├── components/
│   │   ├── ui/               # shadcn/ui
│   │   ├── layout/           # Header, Footer, SkipLinks
│   │   ├── iza/              # IzaAvatar, IzaMessage
│   │   ├── wizard/           # ProgressBar, StepCard
│   │   ├── media/            # AudioRecorder, VideoRecorder
│   │   ├── forms/            # IdentificacaoForm
│   │   └── accessibility/    # AccessibilityPanel
│   │
│   ├── hooks/                # Hooks customizados
│   │   ├── useMediaRecorder.ts
│   │   ├── usePhotoCapture.ts
│   │   ├── useFileUpload.ts
│   │   └── useAccessibility.ts
│   │
│   ├── lib/                  # Utilitários
│   │   ├── db.ts             # Dexie.js config
│   │   ├── constants.ts      # Constantes
│   │   ├── validations.ts    # Schemas Zod
│   │   └── utils.ts          # Funções utilitárias
│   │
│   ├── stores/               # Zustand stores
│   │   └── manifestacaoStore.ts
│   │
│   ├── styles/               # Design tokens
│   │   └── design-tokens.css
│   │
│   └── types/                # Tipos TypeScript
│       ├── manifestacao.ts
│       └── anexo.ts
│
├── scripts/
│   └── generate-icons.js     # Gerador de ícones PWA
│
├── docs/                     # Documentação
│   ├── analise-participa-df.md
│   └── plans/
│
└── CLAUDE.md                 # Guia para desenvolvimento com IA
```

---

## API

### POST /api/manifestacao

Endpoint para envio de manifestações.

**Request Body:**
```json
{
  "tipo": "reclamacao",
  "assunto": {
    "categoria": "saude",
    "subcategoria": "atendimento",
    "orgao": "ses-df"
  },
  "relato": "Descrição detalhada da situação...",
  "anonimo": false,
  "identificacao": {
    "nome": "João da Silva",
    "cpf": "12345678901",
    "email": "joao@email.com",
    "telefone": "61999999999",
    "notificacoes": true
  },
  "anexos": [
    {
      "nome": "documento.pdf",
      "tipo": "documento",
      "tamanho": 1024000,
      "gravadoNativo": false
    }
  ]
}
```

**Response Success (201):**
```json
{
  "success": true,
  "protocolo": "2026.01.123456",
  "dataCriacao": "2026-01-20T15:30:00.000Z",
  "previsaoResposta": "2026-02-19T15:30:00.000Z"
}
```

---

## Testes

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Build (inclui verificações)
npm run build
```

### Acessibilidade

O projeto utiliza **axe-core** integrado em desenvolvimento para verificação automática de violações WCAG. Erros são exibidos no console do navegador.

---

## Critérios de Avaliação

### P1: Critérios de Entrega (10 pontos)

| Critério | Pontos | Status |
|----------|--------|--------|
| Acessibilidade WCAG 2.1 AA | 2,5 | ✅ Implementado |
| Multicanalidade | 3,0 | ✅ Implementado |
| UX/UI | 3,0 | ✅ Implementado |
| Integração Participa DF | 1,5 | ✅ Implementado |

### P2: Documentação (10 pontos)

| Critério | Pontos | Status |
|----------|--------|--------|
| Qualidade do Código | 4,0 | ✅ TypeScript strict |
| Lógica e Funcionamento | 3,0 | ✅ Fluxo completo |
| README com instruções | 1,0 | ✅ Este documento |
| Vídeo demonstrativo | 1,0 | ⏳ Pendente |
| Clareza e Organização | 1,0 | ✅ Estrutura lógica |

---

## Uso de IA no Desenvolvimento

Conforme item 13.9 do edital, este projeto utilizou assistência de Inteligência Artificial (**Claude Code** - Anthropic) para:

- Aceleração do desenvolvimento
- Revisão de código e acessibilidade
- Otimização de performance
- Documentação técnica

A IA foi utilizada como ferramenta de apoio, com todas as decisões técnicas e criativas sendo validadas e supervisionadas pela equipe.

---

## Autor

**Iuri Leão**

---

## Licença

Este projeto foi desenvolvido para o **1º Hackathon em Controle Social: Desafio Participa DF**.

Conforme item 10.3 do edital, a propriedade intelectual é cedida à Controladoria-Geral do Distrito Federal (CGDF).

---

## Links Úteis

- [Edital do Hackathon](docs/DODF-hackathon.md)
- [Análise do Sistema Atual](docs/analise-participa-df.md)
- [Plano de Implementação](docs/plans/2026-01-20-pwa-ouvidoria-design.md)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Next.js Documentation](https://nextjs.org/docs)

---

<p align="center">
  <sub>Desenvolvido com dedicação para o Governo do Distrito Federal</sub><br>
  <sub>Hackathon Participa DF — Prazo: 30/01/2026</sub>
</p>
