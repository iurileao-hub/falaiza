# FalaIZA — Resumo Executivo

**Autor:** Iúri Leão de Almeida
**Telefone:** (61) 99645-1390
**E-mail:** iurileao@gmail.com

**1º Hackathon em Controle Social: Desafio Participa DF**
**Categoria:** II - Ouvidoria
**Repositório:** https://github.com/iurileao-hub/falaiza

---

## Objetivo

A IZA é uma PWA (Progressive Web App) de ouvidoria com classificação automática de manifestações por IA. O sistema substitui formulários burocráticos por uma experiência conversacional guiada, onde o cidadão conta sua história e a assistente virtual IZA classifica automaticamente o tipo de manifestação e órgão responsável.

---

## Tipos de Manifestação Suportados

Conforme item 2.2.II do Edital nº 10/2025:

| Tipo | Descrição | Anonimato |
|------|-----------|-----------|
| **Reclamação** | Insatisfação com serviço público | Permitido |
| **Denúncia** | Relato de irregularidade | Permitido |
| **Sugestão** | Proposta de melhoria | Identificado |
| **Elogio** | Reconhecimento de bom serviço | Identificado |
| **Solicitação** | Pedido de providência | Identificado |
| **Informação** | Pedido de esclarecimento | Identificado |

---

## Arquitetura da Solução

```
Relato do Cidadão
       │
       ▼
┌──────────────────────────────────────────────┐
│ Camada 1: MOTOR DE REGRAS                    │
│ • 800+ palavras-chave categorizadas          │
│ • Extração de entidades (39 RAs do DF)       │
│ • 100% local, < 50ms, funciona offline       │
│ • Otimizado para 100% precisão               │
└──────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│ Camada 2: BACKEND GDF                        │
│ • API REST preparada para BERTimbau          │
│ • Mock funcional para demonstração           │
│ • Conformidade LAI + LGPD                    │
└──────────────────────────────────────────────┘
       │
       ▼
   Resultado: Tipo + Órgão + Confiança
```

---

## Resultados da Otimização da Camada 1

A Camada 1 foi otimizada através de metodologia de testes iterativos:

| Métrica | Antes | Depois |
|---------|-------|--------|
| **Tipos corretos** | 20% | 100% |
| **Órgãos corretos** | 20% | 100% |
| **Ambos corretos** | 20% | 100% |

**Melhoria:** +400% em 5 rodadas de otimização

---

## Diferencial: Multicanalidade Simultânea

O cidadão pode combinar múltiplos formatos na mesma manifestação:

| Tipo | Limite | Captura |
|------|--------|---------|
| **Texto** | 10.000 chars | Textarea |
| **Áudio** | 5 min / 10 MB | MediaRecorder |
| **Vídeo** | 2 min / 15 MB | MediaRecorder |
| **Foto** | 5 MB | Camera API |
| **Documento** | 10 MB | Upload |

---

## Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/iurileao-hub/falaiza.git
cd falaiza

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm run dev

# 4. Acesse
open http://localhost:3000
```

---

## Tecnologias Utilizadas

| Componente | Tecnologia |
|------------|------------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript strict |
| Estilização | Tailwind CSS + shadcn/ui |
| Estado | Zustand |
| Persistência | IndexedDB (Dexie.js) |
| PWA | Serwist (Service Worker) |
| IA | Motor de Regras + API Backend |

---

## Uso de Inteligência Artificial

Conforme item 13.9 do Edital nº 10/2025:

- **Ferramenta:** Claude Code (Anthropic)
- **Classificação:** Motor de regras proprietário (Camada 1) + API Backend (Camada 2)
- **Atividades assistidas:** Arquitetura, implementação, otimização de keywords, documentação
- **Responsabilidade:** Código integralmente de responsabilidade do autor

---

## Estrutura do Projeto

```
falaiza/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── manifestacao/       # Wizard de 5 etapas
│   │   └── api/ia/             # API de classificação
│   ├── components/
│   │   ├── iza/                # Componentes IZA
│   │   └── accessibility/      # Painel A11y
│   └── lib/iza/                # Motor de classificação
├── docs/                       # Documentação técnica
├── scripts/                    # Scripts de teste
└── submissao/                  # Documentos de submissão
```

---

## Acessibilidade (WCAG 2.1 AA)

- Navegação 100% por teclado
- Contraste mínimo 4.5:1
- Skip links funcionais
- ARIA labels em todos componentes
- Painel de acessibilidade (Alt+A)
- Alto contraste, ajuste de fonte, redução de animações

---

## Licença

Projeto desenvolvido para o **1º Hackathon em Controle Social: Desafio Participa DF**.

Controladoria-Geral do Distrito Federal (CGDF) — Janeiro 2026.
