# Análise do Sistema Participa DF - Ouvidoria

> Análise realizada em 20/01/2026 para embasar o desenvolvimento da PWA de Ouvidoria

## 1. Visão Geral do Sistema Atual

O Participa DF é a plataforma de participação social do Governo do Distrito Federal, reunindo os serviços de **Ouvidoria** e **Acesso à Informação**.

**URL:** https://www.participa.df.gov.br

---

## 2. Paleta de Cores

### Cores Principais

| Cor | Hex | RGB | Uso |
|-----|-----|-----|-----|
| Azul Escuro (Primary) | `#192D4B` | rgb(25, 45, 75) | Header, navegação, menu lateral |
| Azul Institucional | `#0062AE` | rgb(0, 98, 174) | Links, destaques |
| Azul Médio | `#28477D` | rgb(40, 71, 125) | Botões secundários, wizard steps |
| Verde (Success) | `#549250` | rgb(84, 146, 80) | Botão "Avançar", ações primárias |
| Azul Bootstrap | `#0D6EFD` | rgb(13, 110, 253) | Links hover |
| Texto Principal | `#212529` | rgb(33, 37, 41) | Corpo de texto |
| Texto Secundário | `#424242` | rgb(66, 66, 66) | Textos auxiliares |
| Fundo | `#FFFFFF` | rgb(255, 255, 255) | Background principal |

### Cores do Logo GDF
- **Amarelo GDF:** Usado no logo do Governo do Distrito Federal
- **Verde/Azul:** Ícones do 162 e chat da Ouvidoria

---

## 3. Tipografia

### Fontes Utilizadas

| Fonte | Uso |
|-------|-----|
| **Montserrat** | Fonte principal para títulos e corpo |
| **Muli** | Fonte alternativa/fallback |
| **Inter** | Usada em alguns componentes |
| **IcoFont** | Ícones |

### Hierarquia Sugerida
```css
font-family: 'Montserrat', 'Muli', 'Helvetica', 'Arial', sans-serif;
```

---

## 4. Persona IZA - Assistente Virtual

### Identidade
- **Nome:** IZA
- **Descrição oficial:** "A IZA é a robô da Ouvidoria que vai te ajudar a realizar seu registro. Ela te dará dicas importantes!"
- **Gênero:** Feminino (referida como "a robô")

### Tom de Voz
- Amigável e acolhedor
- Usa primeira pessoa
- Oferece ajuda proativa
- Fornece orientações claras

### Exemplos de Falas
| Contexto | Fala |
|----------|------|
| Boas-vindas | "Olá! Sou a IZA e vou te ajudar no seu relato." |
| Orientação | "Para que tudo ocorra bem é importante que seu relato seja sobre um tema por vez e bem detalhado." |
| Dica de mídia | "Você poderá também anexar documentos, fotos ou vídeos que me ajudem a resolver sua demanda." |
| Feedback positivo | "Agradeço pelas informações" |
| Fallback | "Não foi possível sugerir um assunto para seu relato." |
| Suporte | "Olá! Se você não conseguir fazer o seu registro, ligue na Central 162." |

### Características Visuais do Avatar
- Robô humanóide estilizado
- Cores: azul claro/turquesa, cinza, branco
- Estilo: friendly, moderno, acessível
- Variações:
  - Com lupa (etapa de identificação)
  - Padrão (outras etapas)

---

## 5. Fluxo de Manifestação (Wizard)

### Etapas do Wizard Atual

| # | Etapa | Descrição |
|---|-------|-----------|
| 1 | **Relato** | Campo de texto livre (mín. 20, máx. 13.000 caracteres) |
| 2 | **Assunto** | Classificação/categorização do relato (busca com autocomplete) |
| 3 | **Resumo** | Revisão do que foi informado |
| 4 | **Identificação** | Dados pessoais ou opção anônima |
| 5 | **Anexos** | Upload de arquivos (docs, fotos, vídeos) |
| 6 | **Protocolo** | Geração e exibição do número de protocolo |

### Regras de Upload (Anexos)
- **Limite:** 25 MB total
- **Formatos permitidos:** pdf, png, xlsx, docx, jpg, jpeg, mp3, mp4

---

## 6. Tipos de Manifestação

| Tipo | Permite Anonimato | Descrição |
|------|-------------------|-----------|
| Reclamação | ✅ Sim | Insatisfação com serviço público |
| Denúncia | ✅ Sim | Comunicação de irregularidade |
| Sugestão | ❌ Não | Proposta de melhoria |
| Elogio | ❌ Não | Reconhecimento positivo |
| Solicitação | ❌ Não | Pedido de serviço |
| Informação | ❌ Não | Pedido de esclarecimento |

**Nota:** Manifestações anônimas não podem ser acompanhadas nem recebem resposta.

---

## 7. Canais de Atendimento

| Canal | Disponibilidade |
|-------|-----------------|
| **Participa DF** (Web) | 24/7 |
| **Central 162** (Telefone) | Seg-Sex: 7h-21h / Fins de semana e feriados: 8h-18h |
| **Presencial** | Horário comercial nos órgãos do GDF |

---

## 8. Recursos de Acessibilidade Existentes

### Plugin Perto Digital
O sistema utiliza o plugin **Perto Digital** com os seguintes recursos:

#### Perfis de Acessibilidade
- Baixa Visão
- Daltonismo
- Epilepsia
- TDAH
- Dislexia

#### Ajustes Disponíveis
- **Texto:** Tamanho, espaçamento, formatação
- **Cores:** Cor do texto, título, fundo, contraste, saturação
- **Navegação:** Por face, pelo teclado, inteligente
- **Conteúdo:** Leitura de conteúdo
- **Som:** Recursos sonoros

#### Atalhos
- `Option + C`: Ativar perfil cego
- `Option + P`: Abrir painel de acessibilidade

#### LIBRAS
- Botão de intérprete de LIBRAS disponível nas páginas

---

## 9. Componentes UI Identificados

### Navegação
- Header com logo GDF + Participa DF
- Barra de navegação horizontal (azul escuro)
- Menu dropdown para subseções

### Wizard
- Menu lateral vertical com etapas
- Etapa ativa destacada (fundo azul escuro)
- Botões "Voltar" (outline) e "Avançar" (verde, filled)

### Formulários
- Campos de texto com placeholder descritivo
- Contador de caracteres
- Validação com mensagens inline

### Cards
- Cards grandes para seleção de serviço (Acesso à Info / Ouvidoria)
- Ícones ilustrativos
- Botões de ação "Acessar aqui"

### Accordion/FAQ
- Perguntas expansíveis com seta
- Conteúdo revelado ao clicar

### Feedback
- IZA com balão de mensagem contextual
- Dicas laterais

---

## 10. Arquitetura Técnica Observada

### URLs
- Base: `https://www.participa.df.gov.br`
- Registro: `/pages/registro-manifestacao/{etapa}`
- FAQ: `/static/faq-ouvidoria`
- Auth: `/pages/auth`

### Padrões de Rota
```
/pages/registro-manifestacao/relato
/pages/registro-manifestacao/assunto
/pages/registro-manifestacao/resumo
/pages/registro-manifestacao/identificacao
/pages/registro-manifestacao/anexos
/pages/registro-manifestacao/protocolo
```

---

## 11. Recomendações para a PWA

### Manter do Sistema Original
1. ✅ Paleta de cores (integração visual)
2. ✅ Persona IZA e tom de voz
3. ✅ Estrutura do wizard (6 etapas)
4. ✅ Tipos de manifestação
5. ✅ Regras de anonimato
6. ✅ Formatos de arquivo suportados
7. ✅ Suporte a LIBRAS (se possível)

### Melhorar/Inovar
1. 🚀 Interface conversacional híbrida (wizard + chat)
2. 🚀 Gravação de áudio nativa (não só upload)
3. 🚀 Gravação de vídeo nativa
4. 🚀 Captura de foto pela câmera
5. 🚀 Modo offline (PWA)
6. 🚀 Notificações push
7. 🚀 Acessibilidade nativa (não depender de plugin)
8. 🚀 Feedback em tempo real da IZA

---

## 12. Assets para Reproduzir

### Logos Necessários
- [ ] Logo GDF (amarelo)
- [ ] Logo Participa DF (texto azul com setas)
- [ ] Logo Ouvidoria (162 + chat)
- [ ] Avatar IZA (múltiplas poses)

### Ícones
- [ ] Ícone 162 (amarelo)
- [ ] Ícone chat (verde)
- [ ] Ícone acessibilidade
- [ ] Ícone LIBRAS

---

## Referências Legais

- **Lei Geral de Proteção de Dados:** Lei nº 13.709/2018
- **Instrução Normativa CGDF:** nº 01 de 05/05/2017, Art. 14
- **WCAG 2.1 AA:** Diretrizes de acessibilidade web
