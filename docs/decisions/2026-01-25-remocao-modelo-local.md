# ADR-001: Remoção do Modelo Local (Camada 2)

**Data:** 2026-01-25
**Status:** Aceita
**Decisores:** Equipe de desenvolvimento

## Contexto

O sistema IZA Inteligente foi inicialmente projetado com 3 camadas de classificação:

1. **Camada 1 - Regras:** Palavras-chave e extração de entidades (100% local)
2. **Camada 2 - Modelo Local:** MobileBERT via CDN (~100MB download)
3. **Camada 3 - Backend GDF:** API com modelo robusto no servidor

## Problema

Durante os testes da Camada 2 (modelo local), identificamos problemas críticos:

### Problemas Técnicos
- Download de ~100MB via CDN apresentou falhas intermitentes
- Web Workers + IndexedDB + CDN = muitos pontos de falha
- Cache do modelo nem sempre funcionava corretamente

### Problemas de UX/Acessibilidade
- **Barreira para usuários:** Download de 100MB é proibitivo para conexões lentas
- **Confusão conceitual:** "Baixar modelo de IA" não faz sentido para usuário comum
- **Analfabetos digitais:** Público-alvo inclui pessoas sem familiaridade tecnológica
- **Valor agregado baixo:** Nos testes, o modelo local não melhorou significativamente a classificação já feita pela Camada 1

### Citação do usuário durante revisão:
> "Esse serviço público tem de priorizar a acessibilidade por todo tipo de usuário, inclusive os analfabetos digitais. Me parece que o investimento numa primeira camada mais robusta seja mais adequado e que a segunda camada mais adequada seja um modelo mais robusto no servidor do GDF."

## Decisão

**Remover a Camada 2 (modelo local)** e simplificar a arquitetura para:

```
┌─────────────────────────────────────────────────┐
│  CAMADA 1: REGRAS                               │
│  • 100% local, instantâneo, offline             │
│  • Palavras-chave + extração de entidades       │
│  • Sem dependências externas                    │
└─────────────────────────────────────────────────┘
              │
              ▼ (opcional, se online)
┌─────────────────────────────────────────────────┐
│  CAMADA 2: API GDF                              │
│  • Transparente para o usuário                  │
│  • Modelo robusto no servidor (BERTimbau/GPT)   │
│  • HTTPS + conformidade LGPD                    │
│  • Fallback automático para Camada 1            │
└─────────────────────────────────────────────────┘
```

## Consequências

### Positivas
- **Zero fricção:** Usuário não precisa entender ou decidir nada sobre IA
- **Mais acessível:** Funciona igual para todos os usuários
- **Mais confiável:** Uma requisição HTTP é mais simples que Web Worker + CDN + IndexedDB
- **Melhor modelo potencial:** Servidor pode rodar modelos maiores e mais precisos
- **Suporte multimodal:** Servidor pode processar áudio, vídeo e imagens (impossível no browser)
- **Código mais simples:** Menos pontos de falha, manutenção mais fácil

### Negativas
- **Dependência de rede:** Camada 2 requer conexão (mas Camada 1 funciona offline)
- **Privacidade:** Texto é enviado ao servidor (mitigado por HTTPS + LGPD)

### Neutras
- **Custo de servidor:** Modelo no servidor tem custo operacional (responsabilidade do GDF)

## Arquivos Removidos/Simplificados

| Arquivo | Ação |
|---------|------|
| `src/lib/iza/model-local.ts` | Removido |
| `src/components/iza/ModeloLocalDownload.tsx` | Removido |
| `src/hooks/useModeloPreload.ts` | Removido |
| `public/workers/iza-model-worker.js` | Removido |
| `src/lib/iza/engine.ts` | Simplificado (2 camadas) |

## Alternativas Consideradas

1. **Manter modelo local como opcional:** Rejeitada - adiciona complexidade sem benefício claro
2. **Usar modelo menor (DistilBERT):** Rejeitada - ainda teria problemas de download/UX
3. **Service Worker para cache:** Rejeitada - não resolve problema de UX para primeiro uso

## Referências

- [WCAG 2.1 - Acessibilidade](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lei Geral de Proteção de Dados (LGPD)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- Testes de usabilidade realizados em 2026-01-25
