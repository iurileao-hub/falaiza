# CLAUDE.md — Guia de Desenvolvimento com IA

Este arquivo fornece orientações para o assistente de programação **Claude Code** (Anthropic) ao trabalhar com o código deste repositório.

## Visão Geral do Projeto

**Projeto:** PWA de Ouvidoria para o Participa DF
**Hackathon:** 1º Hackathon em Controle Social: Desafio Participa DF
**Categoria:** II - Ouvidoria
**Objetivo:** Desenvolver uma PWA acessível para registro de manifestações cidadãs
**Prazo:** 30/01/2026 às 23h59

---

## Status do Projeto

**Fase atual:** Planejamento concluído - Pronto para implementação

### Documentação Disponível

- `docs/analise-participa-df.md` — Análise completa do sistema atual
- `docs/plans/2026-01-20-pwa-ouvidoria-design.md` — Plano de implementação detalhado
- `docs/DODF-hackathon.md` — Edital completo

---

## Decisões Técnicas (Definidas)

### Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Framework | Next.js (App Router) | 14.x |
| Linguagem | TypeScript | 5.x |
| Estilização | Tailwind CSS | 3.x |
| Componentes | shadcn/ui (Radix UI) | latest |
| Persistência | IndexedDB (Dexie.js) | 4.x |
| Validação | Zod | 3.x |
| PWA | next-pwa | 5.x |
| Testes A11y | axe-core + jest-axe | latest |

### Abordagem de Design

- **Wizard Conversacional Híbrido** — Combina estrutura de wizard (6 etapas) com tom conversacional da IZA
- **Multicanalidade Simultânea** — Usuário pode enviar texto + áudio + foto + vídeo na mesma manifestação
- **Captura Nativa** — MediaRecorder API para gravação direta (não só upload)
- **Identidade Visual** — Replicar cores, fontes e elementos do Participa DF atual

### Paleta de Cores

```css
--color-primary: #192D4B;      /* Azul escuro (header/nav) */
--color-primary-light: #28477D; /* Azul médio */
--color-success: #549250;       /* Verde (botão avançar) */
--color-info: #0062AE;          /* Azul institucional */
--color-text: #212529;          /* Texto principal */
--color-background: #FFFFFF;    /* Fundo */
```

### Tipografia

```css
font-family: 'Montserrat', 'Muli', sans-serif;
```

---

## Estrutura de Pastas (Definida)

```
hackathon-ouvidoria-df/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── icons/
│   └── assets/
│       ├── iza/           # Avatares da IZA
│       └── logos/         # Logos GDF, Participa DF
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── manifestacao/
│   │   │   ├── layout.tsx
│   │   │   ├── tipo/page.tsx
│   │   │   ├── assunto/page.tsx
│   │   │   ├── relato/page.tsx
│   │   │   ├── anexos/page.tsx
│   │   │   ├── identificacao/page.tsx
│   │   │   └── confirmacao/page.tsx
│   │   └── api/
│   │       └── manifestacao/route.ts
│   │
│   ├── components/
│   │   ├── ui/            # shadcn/ui
│   │   ├── layout/        # Header, Footer, SkipLinks
│   │   ├── iza/           # IzaAvatar, IzaMessage
│   │   ├── wizard/        # ProgressBar, StepCard, Navigation
│   │   ├── media/         # AudioRecorder, VideoRecorder, PhotoCapture
│   │   ├── forms/         # IdentificacaoForm, RelatoTextarea
│   │   └── accessibility/ # AccessibilityPanel, HighContrast
│   │
│   ├── hooks/
│   │   ├── useManifestacao.ts
│   │   ├── useMediaRecorder.ts
│   │   ├── useIndexedDB.ts
│   │   └── useAccessibility.ts
│   │
│   ├── lib/
│   │   ├── db.ts          # Dexie.js config
│   │   ├── protocolo.ts   # Geração de protocolo
│   │   └── validations.ts # Schemas Zod
│   │
│   ├── stores/
│   │   └── manifestacaoStore.ts
│   │
│   └── types/
│       └── manifestacao.ts
│
├── tests/
│   └── a11y/
│
└── docs/
    ├── analise-participa-df.md
    └── plans/
```

---

## Fluxo do Wizard (6 Etapas)

| # | Rota | Descrição | Validação |
|---|------|-----------|-----------|
| 1 | `/manifestacao/tipo` | Tipo de manifestação (6 cards) | Obrigatório |
| 2 | `/manifestacao/assunto` | Categoria/área (busca + chips) | Obrigatório |
| 3 | `/manifestacao/relato` | Texto + mídia simultânea | Mín 20 chars OU 1 mídia |
| 4 | `/manifestacao/anexos` | Adicionar mais arquivos | Opcional (máx 25MB) |
| 5 | `/manifestacao/identificacao` | Dados ou anônimo | Condicional |
| 6 | `/manifestacao/confirmacao` | Resumo + protocolo | Final |

### Tipos de Manifestação

| Tipo | Permite Anonimato |
|------|-------------------|
| Reclamação | Sim |
| Denúncia | Sim |
| Sugestão | Não |
| Elogio | Não |
| Solicitação | Não |
| Informação | Não |

---

## Persona IZA

- **Nome:** IZA
- **Descrição:** Assistente virtual da Ouvidoria do DF
- **Tom:** Amigável, acolhedor, primeira pessoa
- **Variações visuais:** Default, com lupa (identificação), sucesso, erro

### Exemplos de Falas

```
"Olá! Sou a IZA, assistente da Ouvidoria do Distrito Federal."
"Entendi! Você quer fazer uma reclamação."
"Conta pra mim o que aconteceu. Use quantos formatos quiser!"
"Estamos quase lá! Você quer se identificar ou prefere enviar de forma anônima?"
"🎉 Manifestação enviada com sucesso!"
```

---

## Limites de Upload

| Tipo | Duração Máx | Tamanho Máx |
|------|-------------|-------------|
| Áudio | 5 minutos | 10 MB |
| Vídeo | 2 minutos | 15 MB |
| Foto | — | 5 MB |
| Documento | — | 10 MB |
| **Total** | — | **25 MB** |

---

## Acessibilidade (WCAG 2.1 AA)

### Obrigatórios

- Contraste mínimo 4.5:1
- Navegação 100% por teclado
- Skip links funcionais
- ARIA labels em todos componentes
- Landmarks semânticos
- Live regions para feedback
- Foco visível
- Redimensionar até 200%

### Diferenciais

- Painel de acessibilidade (Alt+A)
- Modo alto contraste
- Controle de tamanho de fonte
- Reduzir animações
- Testes automatizados (axe-core)

---

## Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Testes de acessibilidade
npm run test:a11y

# Lighthouse audit
npm run lighthouse
```

---

## Critérios de Avaliação

### P1: Critérios de Entrega (10 pontos)

| Critério | Pontos | Meta |
|----------|--------|------|
| Acessibilidade WCAG 2.1 AA | 2,5 | Lighthouse ≥95, axe-core 0 erros |
| Multicanalidade | 3,0 | Texto + áudio + vídeo + foto simultâneos |
| UX/UI | 3,0 | Wizard conversacional + IZA |
| Integração Participa DF | 1,5 | Visual idêntico ao atual |

### P2: Documentação (10 pontos)

| Critério | Pontos | Meta |
|----------|--------|------|
| Qualidade do Código | 4,0 | TypeScript strict, componentes organizados |
| Lógica e Funcionamento | 3,0 | Fluxo completo funcional |
| README com instruções | 1,0 | Setup claro |
| Vídeo demonstrativo | 1,0 | ≤7 min |
| Clareza e Organização | 1,0 | Estrutura lógica |

**Meta: 20/20 pontos**

---

## Diretrizes de Código

1. **Linguagem:** Comentários e documentação em **português brasileiro**
2. **TypeScript:** Modo strict, sem `any`
3. **Componentes:** Um por arquivo, nomes descritivos
4. **Acessibilidade:** ARIA em todos os componentes interativos
5. **Semântica:** HTML semântico (header, main, nav, section)
6. **Testes:** axe-core em todas as páginas
7. **IA:** Uso documentado conforme item 13.9 do edital

---

## Recursos Úteis

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN - MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [Radix UI - Primitives](https://www.radix-ui.com/primitives)
- [Dexie.js - IndexedDB](https://dexie.org/)
- [next-pwa](https://github.com/shadowwalker/next-pwa)

---

## Próxima Sessão

**Objetivo:** Implementação completa do projeto

**Comando sugerido:**
```
Implemente o projeto seguindo o plano em docs/plans/2026-01-20-pwa-ouvidoria-design.md
```

O plano contém:
- Arquitetura completa de pastas
- Todos os componentes especificados
- Design system com cores e tokens
- Fluxo detalhado de cada etapa
- Configurações de PWA e acessibilidade
- Sequência de implementação em 12 fases
