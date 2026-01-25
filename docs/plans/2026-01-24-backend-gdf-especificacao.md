# Especificação Técnica: Backend GDF para Classificação Inteligente

**Data:** 2026-01-24
**Status:** Especificação para implementação futura
**Versão:** 1.0.0

## Visão Geral

Este documento especifica as opções técnicas para implementação real da Camada 3 (Backend GDF) do sistema IZA Inteligente. O objetivo é fornecer ao GDF um guia completo de modelos, arquiteturas e configurações recomendadas.

---

## 1. Modelos de IA Recomendados para Português

### 1.1 Modelos de Classificação (BERT-based)

#### BERTimbau (Recomendado para Classificação)

| Modelo | Parâmetros | Tamanho | Uso Recomendado |
|--------|------------|---------|-----------------|
| `neuralmind/bert-base-portuguese-cased` | 110M | ~440MB | Classificação de texto, NER |
| `neuralmind/bert-large-portuguese-cased` | 335M | ~1.3GB | Alta precisão, mais recursos |

**Características:**
- Treinado no corpus brWaC (2.7 bilhões de tokens em português)
- Licença MIT (uso livre, inclusive comercial)
- 51M+ downloads, amplamente testado
- Excelente para fine-tuning em classificação de manifestações

**Exemplo de Fine-tuning:**
```python
from transformers import BertForSequenceClassification, BertTokenizer

model = BertForSequenceClassification.from_pretrained(
    'neuralmind/bert-base-portuguese-cased',
    num_labels=6  # reclamação, denúncia, elogio, sugestão, solicitação, informação
)
tokenizer = BertTokenizer.from_pretrained('neuralmind/bert-base-portuguese-cased')
```

#### Modelos Especializados em Domínio Jurídico/Governamental

| Modelo | Descrição | Link |
|--------|-----------|------|
| `alfaneo/bertimbaulaw-base-portuguese-cased` | Fine-tuned em textos jurídicos | [HuggingFace](https://hf.co/alfaneo/bertimbaulaw-base-portuguese-cased) |

### 1.2 Modelos Generativos (LLMs)

#### Sabiá (Maritaca AI) - LLM Brasileiro

| Modelo | Parâmetros | Quantização | RAM Mínima |
|--------|------------|-------------|------------|
| `maritaca-ai/sabia-7b` | 7B | FP16 | 16GB |
| `RichardErkhov/maritaca-ai_-_sabia-7b-gguf` | 7B | Q4_K_M | 6GB |

**Características:**
- Desenvolvido pela Maritaca AI (empresa brasileira)
- Otimizado para português brasileiro
- Baseado em Llama, com fine-tuning extensivo em PT-BR
- Ideal para geração de resumos e análise contextual

**Caso de Uso:**
- Geração de resumos de manifestações
- Análise de sentimento contextualizada
- Extração de entidades complexas

#### Llama Fine-tuned para Português

| Modelo | Base | Uso |
|--------|------|-----|
| `rhaymison/Llama-portuguese-13b-Luana-v0.2` | Llama-2-13B | Conversação em PT-BR |
| `adalbertojunior/Llama-3-8B-Dolphin-Portuguese-v0.3` | Llama-3-8B | Tarefas gerais |

### 1.3 Modelos de Embeddings (Busca Semântica)

Para classificação por similaridade ou busca em base de conhecimento:

| Modelo | Idiomas | Downloads | Tamanho |
|--------|---------|-----------|---------|
| `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` | 50+ (inclui PT) | 17M+ | ~470MB |
| `sentence-transformers/paraphrase-multilingual-mpnet-base-v2` | 50+ (inclui PT) | 6M+ | ~1GB |

**Uso Recomendado:**
- Busca de manifestações similares
- Detecção de duplicatas
- Classificação por similaridade com exemplos

### 1.4 Modelos Multimodais (Recomendado para Multicanalidade)

A PWA Ouvidoria permite que cidadãos enviem manifestações em múltiplos formatos (texto, áudio, vídeo, foto). Para maximizar a acessibilidade e atender usuários que preferem comunicação oral ou visual, recomenda-se fortemente o uso de modelos multimodais.

#### Por que Multimodal?

| Cenário | Problema | Solução Multimodal |
|---------|----------|-------------------|
| Usuário envia áudio | Texto vazio, classificação impossível | Transcrição + análise de sentimento |
| Usuário envia foto de documento | Imagem sem contexto textual | OCR + extração de entidades |
| Usuário envia vídeo de reclamação | Conteúdo rico não processado | Transcrição de fala + análise visual |
| Usuário com baixa alfabetização | Dificuldade em escrever | Preferência por áudio/vídeo |

#### Modelos Multimodais Recomendados

| Modelo | Modalidades | Uso Recomendado | Licença |
|--------|-------------|-----------------|---------|
| **GPT-4o** (OpenAI) | Texto, Imagem, Áudio | Classificação completa, alta precisão | Comercial |
| **Gemini 1.5 Pro** (Google) | Texto, Imagem, Áudio, Vídeo | Análise de vídeo longo, multimodal nativo | Comercial |
| **Claude 3.5 Sonnet** (Anthropic) | Texto, Imagem | Análise de documentos, fotos | Comercial |
| **LLaVA** (Open Source) | Texto, Imagem | Self-hosted, controle total | Apache 2.0 |
| **Whisper** (OpenAI) | Áudio → Texto | Transcrição de áudio/vídeo | MIT |

#### Arquitetura Multimodal Proposta

```
┌─────────────────────────────────────────────────────────────────────┐
│                  PROCESSAMENTO MULTIMODAL                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Manifestação (texto + áudio + foto + vídeo)                       │
│                           │                                         │
│          ┌────────────────┼────────────────┐                        │
│          ▼                ▼                ▼                        │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│   │   TEXTO     │  │   ÁUDIO     │  │   IMAGEM    │                 │
│   │ (direto)    │  │  (Whisper)  │  │  (OCR/VLM)  │                 │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                 │
│          │                │                │                        │
│          └────────────────┼────────────────┘                        │
│                           ▼                                         │
│                  ┌─────────────────┐                                │
│                  │   TEXTO UNIFICADO   │                            │
│                  │  (concatenação)     │                            │
│                  └──────────┬──────────┘                            │
│                             ▼                                       │
│                  ┌─────────────────┐                                │
│                  │   CLASSIFICAÇÃO  │                               │
│                  │   (BERTimbau)    │                               │
│                  └─────────────────┘                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Whisper para Transcrição de Áudio

```python
import whisper

# Modelo recomendado para português
model = whisper.load_model("large-v3")

def transcrever_audio(audio_path: str) -> str:
    result = model.transcribe(
        audio_path,
        language="pt",
        task="transcribe"
    )
    return result["text"]
```

| Modelo Whisper | Parâmetros | Precisão PT-BR | VRAM |
|----------------|------------|----------------|------|
| `tiny` | 39M | Baixa | 1GB |
| `base` | 74M | Média | 1GB |
| `small` | 244M | Boa | 2GB |
| `medium` | 769M | Muito boa | 5GB |
| `large-v3` | 1.5B | Excelente | 10GB |

#### Análise de Imagens

Para fotos de documentos, recibos, ou situações:

```python
# Opção 1: API multimodal (GPT-4o, Gemini, Claude)
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Analise esta imagem e extraia informações relevantes para uma manifestação de ouvidoria:"},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]
        }
    ]
)

# Opção 2: Self-hosted com LLaVA
from transformers import LlavaForConditionalGeneration, AutoProcessor

model = LlavaForConditionalGeneration.from_pretrained("llava-hf/llava-1.5-7b-hf")
processor = AutoProcessor.from_pretrained("llava-hf/llava-1.5-7b-hf")
```

#### Estimativa de Custos para Multimodal

| Serviço | Modalidade | Custo Estimado |
|---------|------------|----------------|
| GPT-4o | Texto + Imagem | ~$0.01 por manifestação |
| Gemini 1.5 Pro | Texto + Imagem + Áudio | ~$0.007 por manifestação |
| Whisper API | Áudio (5 min) | ~$0.03 por áudio |
| Self-hosted (LLaVA + Whisper) | Todas | Custo de infraestrutura |

#### Recomendação Final para GDF

Para um serviço público acessível a todos os cidadãos, incluindo aqueles com baixa alfabetização digital:

1. **Transcrição obrigatória**: Todo áudio/vídeo deve ser transcrito automaticamente
2. **OCR em fotos**: Documentos e recibos devem ser processados
3. **Fallback robusto**: Se multimodal falhar, classificar apenas o texto disponível
4. **Sem interação extra**: Processamento 100% automático, sem perguntas ao usuário

---

## 2. Arquiteturas de Backend

### 2.1 Arquitetura Simplificada (Recomendada para MVP)

```
┌─────────────────────────────────────────────────────────────┐
│                    ARQUITETURA MVP                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PWA Ouvidoria                                              │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────┐                                            │
│  │   API GDF   │  FastAPI / Flask                           │
│  │   Gateway   │  (autenticação, rate limiting)             │
│  └──────┬──────┘                                            │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────┐                                            │
│  │  Serviço de │  HuggingFace Transformers                  │
│  │ Classificação│  (BERTimbau fine-tuned)                   │
│  └──────┬──────┘                                            │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────┐                                            │
│  │    Cache    │  Redis (opcional)                          │
│  │  Resultados │  TTL: 24h para textos idênticos            │
│  └─────────────┘                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:**
1. **API Gateway**: FastAPI com autenticação JWT
2. **Serviço de ML**: Modelo BERTimbau carregado em memória
3. **Cache**: Redis para evitar reprocessamento

**Recursos Mínimos:**
- CPU: 4 cores
- RAM: 8GB (modelo base) / 16GB (modelo large)
- Disco: 10GB

### 2.2 Arquitetura Escalável (Produção)

```
┌─────────────────────────────────────────────────────────────┐
│                ARQUITETURA PRODUÇÃO                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐    │
│  │   PWA 1     │     │   PWA 2     │     │   PWA N     │    │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘    │
│         │                   │                   │           │
│         └───────────────────┼───────────────────┘           │
│                             ▼                               │
│                    ┌─────────────┐                          │
│                    │    CDN      │                          │
│                    │  CloudFlare │                          │
│                    └──────┬──────┘                          │
│                           │                                 │
│                           ▼                                 │
│                    ┌─────────────┐                          │
│                    │    Load     │                          │
│                    │  Balancer   │                          │
│                    └──────┬──────┘                          │
│                           │                                 │
│         ┌─────────────────┼─────────────────┐               │
│         ▼                 ▼                 ▼               │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐        │
│  │  API Pod 1  │   │  API Pod 2  │   │  API Pod N  │        │
│  │  (FastAPI)  │   │  (FastAPI)  │   │  (FastAPI)  │        │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘        │
│         │                 │                 │               │
│         └─────────────────┼─────────────────┘               │
│                           │                                 │
│         ┌─────────────────┼─────────────────┐               │
│         ▼                 ▼                 ▼               │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐        │
│  │   ML Pod 1  │   │   ML Pod 2  │   │   ML Pod N  │        │
│  │ (Triton/TGI)│   │ (Triton/TGI)│   │ (Triton/TGI)│        │
│  └─────────────┘   └─────────────┘   └─────────────┘        │
│                           │                                 │
│                           ▼                                 │
│                    ┌─────────────┐                          │
│                    │    Redis    │                          │
│                    │   Cluster   │                          │
│                    └─────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Tecnologias Recomendadas:**
- **Orquestração**: Kubernetes (GKE, EKS, AKS)
- **Serving de ML**: NVIDIA Triton / HuggingFace TGI
- **Cache**: Redis Cluster
- **Monitoramento**: Prometheus + Grafana

### 2.3 Arquitetura Serverless (Custo Otimizado)

Para cargas variáveis com picos de uso:

```
┌─────────────────────────────────────────────────────────────┐
│                ARQUITETURA SERVERLESS                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PWA Ouvidoria                                              │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────────────────┐                    │
│  │     HuggingFace Inference API       │                    │
│  │  ou AWS SageMaker Serverless        │                    │
│  │  ou Google Cloud Run + Vertex AI    │                    │
│  └─────────────────────────────────────┘                    │
│                                                             │
│  Vantagens:                                                 │
│  • Paga apenas pelo uso                                     │
│  • Escala automaticamente                                   │
│  • Sem gerenciamento de infraestrutura                      │
│                                                             │
│  Desvantagens:                                              │
│  • Cold start (1-5s primeira requisição)                    │
│  • Custos maiores em alto volume                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Provedores Recomendados:**
1. **HuggingFace Inference Endpoints**: Deploy direto de modelos HF
2. **AWS SageMaker Serverless**: Integração com ecossistema AWS
3. **Google Vertex AI**: AutoML + modelos customizados

---

## 3. Especificação da API

### 3.1 Endpoint de Classificação

```yaml
POST /api/v1/ia/classificar
Content-Type: application/json
Authorization: Bearer <token>

Request:
{
  "relato": "string (obrigatório, 10-10000 chars)",
  "contexto": {
    "canal": "web" | "app" | "telefone" | "presencial",
    "regiao": "string (opcional, RA do DF)"
  }
}

Response (200 OK):
{
  "tipo": {
    "id": "reclamacao" | "denuncia" | "elogio" | "sugestao" | "solicitacao" | "informacao",
    "confianca": 0.0-1.0,
    "alternativas": [
      { "id": "string", "confianca": 0.0-1.0 }
    ]
  },
  "orgao": {
    "id": "string",
    "confianca": 0.0-1.0,
    "alternativas": [...]
  },
  "entidades": {
    "locais": ["string"],
    "datas": ["string"],
    "orgaos": ["string"],
    "pessoas": ["string"],  // anonimizado se necessário
    "valores": ["string"]
  },
  "resumo": {
    "curto": "string (max 100 chars)",
    "medio": "string (max 300 chars)"
  },
  "sentimento": {
    "polaridade": "positivo" | "neutro" | "negativo",
    "intensidade": 0.0-1.0
  },
  "meta": {
    "versaoModelo": "string",
    "tempoProcessamentoMs": number,
    "processadoEm": "ISO8601",
    "requestId": "UUID"
  }
}

Response (400 Bad Request):
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "string",
    "details": [...]
  }
}

Response (429 Too Many Requests):
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": number (segundos)
  }
}
```

### 3.2 Endpoint de Health Check

```yaml
GET /api/v1/health

Response (200 OK):
{
  "status": "healthy" | "degraded" | "unhealthy",
  "components": {
    "api": { "status": "healthy", "latencyMs": number },
    "model": { "status": "healthy", "loadedAt": "ISO8601" },
    "cache": { "status": "healthy", "hitRate": 0.0-1.0 }
  },
  "version": "string"
}
```

### 3.3 Endpoint de Métricas (Admin)

```yaml
GET /api/v1/admin/metrics
Authorization: Bearer <admin_token>

Response (200 OK):
{
  "periodo": "24h",
  "classificacoes": {
    "total": number,
    "porTipo": { "reclamacao": number, ... },
    "porOrgao": { "saude": number, ... }
  },
  "performance": {
    "tempoMedioMs": number,
    "p95Ms": number,
    "p99Ms": number
  },
  "confianca": {
    "mediaGeral": 0.0-1.0,
    "distribuicao": {
      "alta": number,    // > 0.8
      "media": number,   // 0.5-0.8
      "baixa": number    // < 0.5
    }
  }
}
```

---

## 4. Configuração de Infraestrutura

### 4.1 Docker Compose (Desenvolvimento/MVP)

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: ./api
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/models/bertimbau-classificador
      - REDIS_URL=redis://cache:6379
      - LOG_LEVEL=INFO
    volumes:
      - ./models:/models:ro
    depends_on:
      - cache
    deploy:
      resources:
        limits:
          memory: 8G
        reservations:
          memory: 4G

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

### 4.2 Kubernetes (Produção)

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: classificador-gdf
spec:
  replicas: 3
  selector:
    matchLabels:
      app: classificador
  template:
    metadata:
      labels:
        app: classificador
    spec:
      containers:
      - name: api
        image: gdf/classificador-api:v1.0.0
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "4Gi"
            cpu: "2"
          limits:
            memory: "8Gi"
            cpu: "4"
        env:
        - name: MODEL_PATH
          value: "/models/bertimbau"
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 4.3 Variáveis de Ambiente

```bash
# .env.production
# API
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4
LOG_LEVEL=INFO

# Modelo
MODEL_PATH=/models/bertimbau-classificador-v1
MODEL_MAX_LENGTH=512
MODEL_BATCH_SIZE=8

# Cache
REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=86400

# Segurança
JWT_SECRET=<secret>
RATE_LIMIT_PER_MINUTE=100
CORS_ORIGINS=https://ouvidoria.df.gov.br

# Monitoramento
SENTRY_DSN=<dsn>
PROMETHEUS_ENABLED=true
```

---

## 5. Fine-tuning do Modelo

### 5.1 Dataset Recomendado

Estrutura do dataset para treinamento:

```json
// dataset/train.jsonl
{"text": "O ônibus da linha 110 atrasou mais de 40 minutos hoje", "tipo": "reclamacao", "orgao": "transporte"}
{"text": "Parabéns ao atendente João do hospital de base", "tipo": "elogio", "orgao": "saude"}
{"text": "Sugiro instalar semáforo na QNM 40", "tipo": "sugestao", "orgao": "transporte"}
```

**Requisitos Mínimos:**
- 500+ exemplos por categoria
- Balanceamento entre tipos
- Representatividade regional (RAs do DF)
- Validação por especialistas em ouvidoria

### 5.2 Script de Treinamento

```python
# train_classificador.py
from transformers import (
    BertForSequenceClassification,
    BertTokenizer,
    TrainingArguments,
    Trainer
)
from datasets import load_dataset

# Carregar modelo base
model = BertForSequenceClassification.from_pretrained(
    'neuralmind/bert-base-portuguese-cased',
    num_labels=6
)
tokenizer = BertTokenizer.from_pretrained('neuralmind/bert-base-portuguese-cased')

# Carregar dataset
dataset = load_dataset('json', data_files={
    'train': 'dataset/train.jsonl',
    'validation': 'dataset/val.jsonl'
})

# Tokenização
def tokenize(examples):
    return tokenizer(
        examples['text'],
        padding='max_length',
        truncation=True,
        max_length=512
    )

tokenized = dataset.map(tokenize, batched=True)

# Configuração de treinamento
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
    evaluation_strategy='epoch',
    save_strategy='epoch',
    load_best_model_at_end=True,
)

# Treinar
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized['train'],
    eval_dataset=tokenized['validation'],
)

trainer.train()
trainer.save_model('./models/bertimbau-classificador-v1')
```

---

## 6. Considerações de Segurança e Privacidade

### 6.1 Proteção de Dados (LGPD)

| Aspecto | Implementação |
|---------|---------------|
| **Minimização** | Processar apenas texto necessário |
| **Anonimização** | Remover PII antes de logging |
| **Retenção** | Logs por 90 dias, depois anonimizar |
| **Consentimento** | Implícito ao usar serviço de ouvidoria |
| **Portabilidade** | API para exportar dados do cidadão |

### 6.2 Segurança da API

```python
# Middleware de segurança
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer
from slowapi import Limiter

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)
security = HTTPBearer()

@app.post("/api/v1/ia/classificar")
@limiter.limit("100/minute")
async def classificar(
    request: ClassificacaoRequest,
    token: str = Depends(security)
):
    # Validar token JWT
    if not validate_jwt(token):
        raise HTTPException(status_code=401)

    # Sanitizar input
    relato = sanitize_input(request.relato)

    # Classificar
    resultado = await classificador.predict(relato)

    # Log sem PII
    logger.info(f"Classificação: tipo={resultado.tipo.id}, confianca={resultado.tipo.confianca}")

    return resultado
```

### 6.3 Auditoria

Todos os endpoints devem gerar logs de auditoria:

```json
{
  "timestamp": "2026-01-24T10:30:00Z",
  "requestId": "uuid",
  "endpoint": "/api/v1/ia/classificar",
  "clientIp": "hash(ip)",
  "userId": "hash(user_id)",
  "action": "CLASSIFICACAO",
  "result": {
    "tipo": "reclamacao",
    "confianca": 0.92
  },
  "processingTimeMs": 150
}
```

---

## 7. Estimativa de Custos

> **Nota:** Os modelos são 100% open-source e gratuitos. Os custos abaixo são apenas de infraestrutura (servidores/hospedagem).

### 7.1 Opções Gratuitas / Muito Baixo Custo

| Opção | Custo | Limitações |
|-------|-------|------------|
| **HuggingFace Inference API (Free Tier)** | R$ 0 | Rate limit, cold start de 20-60s |
| **Google Colab + ngrok** | R$ 0 | Sessões de 12h, não é 24/7 |
| **Cloudflare Workers AI** | R$ 0 (10k req/dia) | Modelos limitados, sem BERTimbau |
| **Render.com (Free Tier)** | R$ 0 | 512MB RAM, spin down após inatividade |

### 7.2 Baixo Custo (Recomendado para MVP)

| Opção | Especificação | Custo/Mês |
|-------|---------------|-----------|
| **VPS Básico** (Hostinger, Contabo) | 4 vCPU, 8GB RAM | R$ 80-150 |
| **DigitalOcean Droplet** | 4 vCPU, 8GB RAM | R$ 150-200 |
| **Hetzner Cloud** | 4 vCPU, 8GB RAM | R$ 100-150 |
| **Oracle Cloud Free Tier** | 4 OCPU, 24GB RAM | **R$ 0** (sempre gratuito) |

**Configuração recomendada para MVP:**
```
Oracle Cloud Free Tier (ARM)
├── 4 OCPU Ampere (equivale a ~8 vCPU x86)
├── 24GB RAM
├── 200GB disco
└── Custo: R$ 0/mês
```

### 7.3 Custo Moderado (Produção Básica)

| Opção | Especificação | Custo/Mês |
|-------|---------------|-----------|
| **VPS Dedicado** | 8 vCPU, 16GB RAM | R$ 200-400 |
| **AWS Lightsail** | 8 vCPU, 16GB RAM | R$ 400-500 |
| **Railway.app** | Uso variável | R$ 100-300 |
| **Fly.io** | 4 vCPU, 8GB RAM | R$ 150-250 |

### 7.4 Alto Volume (Produção Escalável)

Apenas necessário se volume > 100.000 requisições/mês:

| Configuração | Custo/Mês |
|--------------|-----------|
| Kubernetes gerenciado + 3 pods | R$ 1.500-3.000 |
| Auto-scaling com picos | R$ 2.000-5.000 |

### 7.5 Comparativo de Custo por Volume

| Volume Mensal | Opção Recomendada | Custo |
|---------------|-------------------|-------|
| < 1.000 req | HuggingFace Free ou Oracle Free | R$ 0 |
| 1.000 - 10.000 req | VPS básico (Hetzner/Contabo) | R$ 80-150 |
| 10.000 - 50.000 req | VPS dedicado | R$ 200-400 |
| 50.000 - 100.000 req | Cloud com auto-scaling | R$ 500-1.000 |
| > 100.000 req | Kubernetes | R$ 1.500+ |

### 7.6 Por que os Modelos são Gratuitos?

| Modelo | Licença | Uso Comercial |
|--------|---------|---------------|
| BERTimbau | MIT | ✅ Livre |
| Sabiá 7B | Apache 2.0 | ✅ Livre |
| Sentence Transformers | Apache 2.0 | ✅ Livre |
| MobileBERT | Apache 2.0 | ✅ Livre |

**Todos os modelos recomendados são open-source com licenças permissivas.** O único custo real é a infraestrutura para executá-los.

### 7.7 Recomendação para o GDF

Para a Ouvidoria do DF (estimativa: 5.000-20.000 manifestações/mês):

```
Opção 1: Oracle Cloud Free Tier
├── Custo: R$ 0/mês
├── Capacidade: ~50.000 req/mês
└── Ideal para: MVP e produção inicial

Opção 2: VPS Hetzner/Contabo
├── Custo: R$ 100-200/mês
├── Capacidade: ~100.000 req/mês
└── Ideal para: Produção estável

Opção 3: Infraestrutura GDF existente
├── Custo: R$ 0 (já pago)
├── Integração com sistemas internos
└── Ideal para: Longo prazo
```

---

## 8. Roadmap de Implementação

### Fase 1: MVP (4-6 semanas)

- [ ] Coletar e anotar dataset inicial (500+ exemplos)
- [ ] Fine-tune BERTimbau para classificação
- [ ] Desenvolver API FastAPI básica
- [ ] Deploy em ambiente de homologação
- [ ] Testes com usuários internos

### Fase 2: Produção (6-8 semanas)

- [ ] Expandir dataset (2000+ exemplos)
- [ ] Implementar cache Redis
- [ ] Configurar monitoramento (Prometheus/Grafana)
- [ ] Deploy em Kubernetes
- [ ] Integração com sistema de ouvidoria atual

### Fase 3: Evolução (Contínuo)

- [ ] Retreinamento periódico com novos dados
- [ ] A/B testing de modelos
- [ ] Implementar modelo de embeddings para busca
- [ ] Adicionar análise de sentimento avançada
- [ ] Integrar LLM para geração de resumos

---

## 9. Contato e Suporte

Para dúvidas técnicas sobre esta especificação:

- **Repositório**: `github.com/gdf/ouvidoria-ia`
- **Documentação API**: `api.ouvidoria.df.gov.br/docs`
- **Email técnico**: `ti.ouvidoria@df.gov.br`

---

*Documento gerado como parte do 1º Hackathon em Controle Social: Desafio Participa DF*
