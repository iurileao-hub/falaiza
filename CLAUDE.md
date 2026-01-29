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

**Fase atual:** IZA Inteligente simplificada (2 camadas)

### Progresso

- [x] PWA base implementada
- [x] Wizard de 5 etapas (story-first)
- [x] IZA Inteligente - Camada 1 (Regras) ✅
- [x] IZA Inteligente - Camada 2 (Backend GDF - Mock) ✅
- [x] Header/Navbar estilo Participa DF
- [x] Acessibilidade (WCAG 2.1 AA)
- [x] Testes automatizados de acessibilidade
- [x] Code review de segurança e qualidade ✅
- [x] Hardening de APIs (validação, max-length, Zod sempre ativo)
- [x] Error Boundary e página 404 customizada
- [x] Otimização de performance (lazy loading, debounce)

### Documentação Disponível

- `docs/analise-participa-df.md` — Análise completa do sistema atual
- `docs/plans/2026-01-20-pwa-ouvidoria-design.md` — Plano de implementação detalhado
- `docs/plans/2026-01-24-backend-gdf-especificacao.md` — **Especificação técnica do Backend GDF** (modelos, arquiteturas, custos)
- `docs/decisions/2026-01-25-remocao-modelo-local.md` — **ADR-001: Remoção do modelo local**
- `docs/decisions/2026-01-25-otimizacao-camada1-testes.md` — **ADR-002: Otimização da Camada 1** ⭐
- `docs/DODF-hackathon.md` — Edital completo

### ✅ Camadas de Classificação Implementadas

| Camada | Tecnologia | Status |
|--------|------------|--------|
| 1 - Regras | Keywords + Extração de entidades | ✅ Funcional (100% precisão) |
| 2 - Backend GDF | Mock API em `/api/ia/classificar` | ✅ Mock funcional |

> **Nota:** O modelo local (MobileBERT) foi removido por decisão arquitetural (ADR-001).
> Motivos: problemas de UX, acessibilidade para usuários leigos, e complexidade desnecessária.

### 🏆 Destaque: Otimização da Camada 1 (ADR-002)

A Camada 1 foi otimizada através de um **loop de testes iterativos**, alcançando:

```
┌────────────────────────────────────────────────────┐
│  ANTES:  20% precisão  →  DEPOIS: 100% precisão   │
│                                                    │
│  ████░░░░░░░░░░░░░░░░  →  ████████████████████    │
│                                                    │
│  Melhoria: +400% em 5 rodadas de otimização       │
└────────────────────────────────────────────────────┘
```

**Metodologia:** Gerar casos de teste → Executar → Analisar erros → Ajustar → Repetir

**Script de testes:** `npx tsx scripts/testar-camada1-completo.ts`

Ver documentação completa em `docs/decisions/2026-01-25-otimizacao-camada1-testes.md`

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

- **Story-First Flow** — Usuário conta sua história primeiro, IZA classifica automaticamente (5 etapas)
- **IZA Inteligente** — Classificação em 2 camadas: Regras (local) → Backend GDF (API)
- **Multicanalidade Simultânea** — Usuário pode enviar texto + áudio + foto + vídeo na mesma manifestação
- **Captura Nativa** — MediaRecorder API para gravação direta (não só upload)
- **Identidade Visual** — Replicar cores, fontes e elementos do Participa DF atual
- **Privacidade por Design** — Camada 1 processa 100% local; Camada 2 usa HTTPS + LGPD
- **Acessibilidade Universal** — Design para todos, incluindo analfabetos digitais

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

## Estrutura de Pastas (Atualizada)

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
│   │   │   ├── relato/page.tsx
│   │   │   ├── sugestao/page.tsx
│   │   │   ├── anexos/page.tsx
│   │   │   ├── identificacao/page.tsx
│   │   │   └── confirmacao/page.tsx
│   │   └── api/
│   │       ├── manifestacao/route.ts
│   │       └── ia/
│   │           └── classificar/route.ts  # Mock Backend GDF (Camada 2)
│   │
│   ├── components/
│   │   ├── ui/            # shadcn/ui
│   │   ├── layout/        # Header, Footer, SkipLinks
│   │   ├── iza/           # Componentes IZA Inteligente
│   │   │   ├── IzaAvatar.tsx
│   │   │   ├── IzaMessage.tsx
│   │   │   ├── IzaSugestaoInteligente.tsx
│   │   │   ├── SeletorComConfianca.tsx
│   │   │   └── ConfiancaIndicator.tsx
│   │   ├── wizard/        # ProgressBar, StepCard, Navigation
│   │   ├── media/         # AudioRecorder, VideoRecorder, PhotoCapture
│   │   ├── forms/         # IdentificacaoForm, RelatoTextarea
│   │   └── accessibility/ # AccessibilityPanel, HighContrast
│   │
│   ├── hooks/
│   │   ├── useManifestacao.ts
│   │   ├── useClassificacao.ts    # Hook para IZA Inteligente
│   │   ├── useMediaRecorder.ts
│   │   ├── useIndexedDB.ts
│   │   └── useAccessibility.ts
│   │
│   ├── lib/
│   │   ├── iza/                   # Sistema IZA Inteligente
│   │   │   ├── index.ts           # Exports públicos
│   │   │   ├── engine.ts          # Orquestrador das 2 camadas
│   │   │   ├── rules-engine.ts    # Motor da Camada 1
│   │   │   ├── keywords.ts        # Regras de palavras-chave (800+)
│   │   │   └── types.ts           # Tipos TypeScript
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
        ├── 2026-01-20-pwa-ouvidoria-design.md
        ├── 2026-01-24-iza-camadas-2-3-design.md
        └── 2026-01-24-backend-gdf-especificacao.md
```

---

## Fluxo do Wizard (5 Etapas - Story-First)

| # | Rota | Descrição | Validação |
|---|------|-----------|-----------|
| 1 | `/manifestacao/relato` | Usuário conta sua história (texto + mídia) | Mín 20 chars OU 1 mídia |
| 2 | `/manifestacao/sugestao` | IZA sugere tipo/área automaticamente | Classificação confirmada |
| 3 | `/manifestacao/anexos` | Adicionar mais arquivos | Opcional (máx 25MB) |
| 4 | `/manifestacao/identificacao` | Dados ou anônimo | Condicional |
| 5 | `/manifestacao/confirmacao` | Resumo + protocolo | Final |

**Páginas obsoletas (redirecionam para novo fluxo):**
- `/manifestacao/tipo` → redireciona para `/manifestacao/relato`
- `/manifestacao/assunto` → redireciona para `/manifestacao/sugestao`

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

### IZA Inteligente - Arquitetura de Classificação

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA 1: REGRAS ✅                       │
│  • Palavras-chave + frases (vocabulário expandido)          │
│  • Extração de entidades (locais, datas, órgãos)            │
│  • 100% local, 0 KB, < 50ms, funciona offline               │
│  • Arquivo: src/lib/iza/rules-engine.ts                     │
├─────────────────────────────────────────────────────────────┤
│                 CAMADA 2: BACKEND GDF ✅                     │
│  • API transparente para o usuário                          │
│  • Mock em /api/ia/classificar (pronto para produção)       │
│  • Modelo robusto no servidor (BERTimbau em produção)       │
│  • HTTPS + LGPD + LAI                                       │
│  • Arquivo: src/app/api/ia/classificar/route.ts             │
└─────────────────────────────────────────────────────────────┘
```

> **ADR-001:** Modelo local (MobileBERT) foi removido por problemas de UX e acessibilidade.
> Ver: `docs/decisions/2026-01-25-remocao-modelo-local.md`

**Arquivos principais:**
- `src/lib/iza/keywords.ts` — Regras de palavras-chave (800+)
- `src/lib/iza/rules-engine.ts` — Engine da Camada 1
- `src/lib/iza/engine.ts` — Orquestrador das 2 camadas
- `src/app/api/ia/classificar/route.ts` — Mock Backend GDF (Camada 2)
- `src/hooks/useClassificacao.ts` — Hook React para classificação
- `src/components/iza/IzaSugestaoInteligente.tsx` — UI de sugestão
- `src/components/iza/SeletorComConfianca.tsx` — Seletor com indicador de confiança

### Exemplos de Falas

```
"Olá! Sou a IZA, assistente da Ouvidoria do Distrito Federal."
"Entendi! Você quer fazer uma reclamação."
"Conta pra mim o que aconteceu. Use quantos formatos quiser!"
"Estamos quase lá! Você quer se identificar ou prefere enviar de forma anônimo?"
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
5. **Semântica:** HTML semântico (header, main, nav, section) — um único `<main>` por página
6. **Testes:** axe-core em todas as páginas
7. **IA:** Uso documentado conforme item 13.9 do edital
8. **Segurança:** Validação Zod em todas as APIs, max-length em inputs, PII não persistido em localStorage
9. **Performance:** Componentes de mídia com lazy loading (`next/dynamic`), debounce em store updates

---

## Recursos Úteis

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN - MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [Radix UI - Primitives](https://www.radix-ui.com/primitives)
- [Dexie.js - IndexedDB](https://dexie.org/)
- [next-pwa](https://github.com/shadowwalker/next-pwa)

---

## Próximas Tarefas

### Prioridade Alta (para o Hackathon)

- [x] **Wizard de manifestação completo** ✅
  - Fluxo de 5 etapas funcionando
  - Classificação automática pela IZA
  - Seleção manual de tipo/órgão
  - Botão "Recomeçar" para limpar e reiniciar

- [x] **IZA Inteligente - Camada 1 otimizada** ✅
  - 100% precisão em testes (ADR-002)
  - 800+ palavras-chave
  - Extração de entidades

- [x] **Testar em produção (Vercel)** ✅
  - Deploy e teste no celular
  - Captura de mídia (áudio, vídeo, foto) funcionando
  - Layout responsivo corrigido

- [ ] **Gravar vídeo demonstrativo** (≤7 min)
  - Mostrar fluxo completo de manifestação
  - Demonstrar classificação inteligente da IZA
  - Destacar acessibilidade e multicanalidade

### Para Implementação Real (pós-hackathon)

- [ ] Integrar com API real do GDF (substituir mock)
- [ ] Configurar BERTimbau para backend de produção
- [ ] Deploy em infraestrutura do GDF

### Documentação de Referência

| Documento | Descrição |
|-----------|-----------|
| `docs/plans/2026-01-20-pwa-ouvidoria-design.md` | Plano completo de implementação |
| `docs/plans/2026-01-24-backend-gdf-especificacao.md` | Especificação técnica Backend GDF |
| `docs/decisions/2026-01-25-remocao-modelo-local.md` | ADR-001: Remoção do modelo local |
| `docs/decisions/2026-01-25-otimizacao-camada1-testes.md` | ADR-002: Otimização da Camada 1 |
