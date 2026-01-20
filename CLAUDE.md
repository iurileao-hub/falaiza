# CLAUDE.md — Guia de Desenvolvimento com IA

Este arquivo fornece orientações para o assistente de programação **Claude Code** (Anthropic) ao trabalhar com o código deste repositório.

## Visão Geral do Projeto

**Projeto:** PWA de Ouvidoria para o Participa DF
**Hackathon:** 1º Hackathon em Controle Social: Desafio Participa DF
**Categoria:** II - Ouvidoria
**Objetivo:** Desenvolver uma PWA acessível para registro de manifestações cidadãs

### Requisitos Funcionais (item 2.2.II e 8.2.1 do Edital)

1. **Multicanalidade** — Registro de manifestações por:
   - Texto (digitação)
   - Áudio (gravação de voz)
   - Imagem (upload/captura)
   - Vídeo (upload/gravação)

2. **Protocolo** — Emissão automática de número de protocolo

3. **Anonimato** — Opção de manifestação anônima

4. **Acessibilidade** — Conformidade com WCAG 2.1 nível AA:
   - Contraste de cores adequado
   - Navegação por teclado
   - Compatibilidade com leitores de tela
   - Alt text em imagens
   - Legendas quando aplicável

5. **PWA** — Progressive Web App instalável

6. **Integração** — Aderência à arquitetura do Participa DF (integração com IA "IZA")

## Status do Projeto

**Fase atual:** Planejamento inicial

### Próximos Passos

Na próxima sessão, devemos:
1. Definir stack tecnológica (React? Vue? Next.js?)
2. Criar estrutura de pastas do projeto
3. Planejar componentes e fluxos de usuário
4. Definir estratégia de acessibilidade
5. Criar backlog de tarefas

## Critérios de Avaliação

### P1: Critérios de Entrega (10 pontos)

| Critério | Pontos | Descrição |
|----------|--------|-----------|
| Acessibilidade (WCAG 2.1 AA) | 2,5 | Contraste, teclado, leitores de tela, alt text |
| Multicanalidade | 3,0 | Texto, áudio, vídeo, imagem |
| UX/UI | 3,0 | Jornada do cidadão, simplicidade, coerência visual |
| Integração com Participa DF | 1,5 | Aderência à arquitetura |

### P2: Documentação (10 pontos)

| Critério | Pontos | Descrição |
|----------|--------|-----------|
| Qualidade do Código | 4,0 | Boas práticas, arquitetura, legibilidade |
| Lógica e Funcionamento | 3,0 | Fluxos implementados corretamente |
| README com instruções | 1,0 | Linguagens, tecnologias, comandos |
| Vídeo demonstrativo (até 7min) | 1,0 | Apresentação do projeto |
| Clareza e Organização | 1,0 | Estrutura de pastas lógica |

### Critérios de Desempate (item 8.2.5.1)

1. Maior nota em Acessibilidade Digital (WCAG)
2. Maior nota em UX/UI
3. Maior potencial de benefício coletivo
4. Maior nota P1
5. Maior nota em Multicanalidade
6. Maior nota P2
7. Ordem cronológica de submissão

## Entregáveis Obrigatórios

1. **Código-fonte** — Repositório público no GitHub/GitLab
2. **README.md** — Instruções de instalação e execução + link do vídeo
3. **Vídeo** — Até 7 minutos demonstrando a solução (YouTube não listado ou similar)

## Prazo

**Submissão:** até 30/01/2026 às 23h59

## Estrutura Planejada

```
hackathon-ouvidoria-df/
├── CLAUDE.md                 # Este arquivo
├── README.md                 # Documentação principal
├── package.json              # Dependências
│
├── docs/                     # Documentação
│   └── DODF-hackathon.md    # Edital completo
│
├── public/                   # Assets estáticos
│   ├── manifest.json        # PWA manifest
│   └── icons/               # Ícones do app
│
├── src/                      # Código-fonte
│   ├── components/          # Componentes React
│   ├── pages/               # Páginas/rotas
│   ├── hooks/               # Custom hooks
│   ├── services/            # APIs e integrações
│   ├── styles/              # CSS/Tailwind
│   └── utils/               # Utilitários
│
└── tests/                    # Testes
```

## Diretrizes de Código

1. **Linguagem:** Comentários e documentação em **português brasileiro**
2. **Acessibilidade:** Seguir WCAG 2.1 AA rigorosamente
3. **Semântica:** Usar HTML semântico (header, main, nav, section, etc.)
4. **ARIA:** Usar atributos ARIA onde necessário
5. **Testes:** Incluir testes de acessibilidade (axe-core)
6. **IA:** Uso documentado conforme item 13.9 do edital

## Recursos Úteis

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs - Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

## Notas sobre Integração

O edital menciona integração com o sistema "IZA" da Ouvidoria-Geral do DF, mas não fornece documentação técnica. Estratégias possíveis:
1. Criar interface mockada que simule a integração
2. Entrar em contato com a organização para solicitar documentação
3. Projetar arquitetura que facilite integração futura

## Contexto Adicional

Este projeto é desenvolvido em paralelo com a **Categoria I (Acesso à Informação)**, que está em `/Users/iurileao/Documents/Projects/hackathon-participa-df/`. A prioridade é a Categoria I, mas este projeto também será submetido.
