Claro! Aqui está a tradução do arquivo `README.md` para o português:

---

# Jyula Email Frontend

Jyula Email Frontend é uma aplicação web projetada para gerenciar e enviar campanhas de e-mail. Permite aos usuários criar e gerenciar templates de e-mail HTML, definir segmentos de audiência, gerenciar contatos e criar e enviar campanhas de e-mail.

## Funcionalidades Principais

* **Gerenciamento de Templates**: Crie novos templates de e-mail HTML usando um editor Monaco com visualização ao vivo, visualize templates existentes e marque templates como favoritos.
* **Criação de Campanhas**: Nomeie campanhas e selecione audiências/segmentos para envio. (Atualmente, usa um fluxo de seleção de template mockado).
* **Gerenciamento de Audiência**: Adicione, visualize, edite e delete contatos (audiências).
* **Navegação**: Uma barra de ferramentas permite a navegação entre diferentes seções como Templates, Segmentos, Audiência, E-mails Enviados, Favoritos e Relatórios.
* **Autenticação de Usuário**: Páginas básicas de login e registro.

## Análise dos Principais Problemas Detectados

O código-base inicial, embora funcional, apresentava diversas áreas para melhoria em linha com os princípios do Clean Code:

1.  **Nomenclatura Inconsistente ou Pouco Descritiva**: Alguns componentes, variáveis e funções tinham nomes genéricos (ex.: `ViwerMonacoTemplate`, `handleClick`) que não transmitiam totalmente sua intenção.
2.  **Componentes com Múltiplas Responsabilidades**: Componentes como `createTemplates.tsx` e `viewerTemplate.tsx` manipulavam UI, gerenciamento de estado e chamadas diretas à API (usando `axios`), levando a um acoplamento mais forte e testabilidade reduzida.
3.  **Duplicação de Código**:
    * A configuração e estilização do editor Monaco estavam duplicadas entre `MonacoEditor.jsx` e `ViewerMonacoTemplate.jsx`.
    * A lógica de feedback de resposta da API (Snackbar/Alerts) estava repetida em `createTemplates.tsx` e `viewerTemplate.tsx`.
4.  **Falta de Tratamento de Erros Robusto**: Embora existissem blocos `try-catch` para chamadas à API, o tratamento de erros poderia ser mais específico, e as funções do modelo lançavam erros genéricos.
5.  **Falta de Tipagem Forte em TypeScript**: Diversos arquivos usavam a extensão `.jsx` (`ViewerMonacoTemplate.jsx`, `MonacoEditor.jsx`, arquivos de layout) em vez de `.tsx`, e as props dentro deles não eram tipadas.
6.  **Falta de Testes Unitários**: Apenas um teste trivial existia em `App.test.ts`, oferecendo cobertura mínima.
7.  **Code Smells e Organização**:
    * `App.tsx` tinha uma definição de rota duplicada potencialmente problemática para `/app/*`.
    * Inconsistência nas chamadas à API: alguns componentes usavam `axios` diretamente, enquanto os modelos usavam `fetch`.
    * O arquivo `src/pages/audiences.tsx` definia internamente um componente chamado `CreateCampaign`, causando confusão.
    * A `BASE_URL` para chamadas à API estava hardcoded nos modelos.
    * Erro de digitação no nome do arquivo: `vitest.conifg.ts` em vez de `vitest.config.ts`.

## Estratégia de Refatoração

A estratégia de refatoração focou em abordar os problemas identificados aderindo aos princípios do Clean Code:

1.  **Melhorar Nomenclatura**:
    * Renomeados componentes e arquivos para clareza (ex.: `ViwerMonacoTemplate.jsx` para `ViewerMonacoTemplate.tsx`, `vitest.conifg.ts` para `vitest.config.ts`).
    * Garantido que nomes de funções e variáveis sejam descritivos.
2.  **Separar Responsabilidades dos Componentes**:
    * Movidas chamadas diretas à API de componentes para a camada `models`.
    * Garantido que componentes foquem na UI e no gerenciamento de estado diretamente relacionado à sua apresentação.
3.  **Centralizar Lógica Duplicada**:
    * Criado um único `MonacoEditorComponent.tsx` reutilizável para o editor HTML.
    * Abstraída a lógica de feedback da API (Snackbar/Alert) para um hook customizado `useApiFeedback.ts`.
4.  **Implementar Tratamento de Erros Robusto**:
    * Melhorado o tratamento de erros nas funções do modelo para fornecer informações de erro mais específicas.
    * Garantido que componentes exibam feedback apropriado com base nas respostas da API.
5.  **Fortalecer Tipagem com TypeScript**:
    * Convertidos todos os arquivos `.jsx` para `.tsx`.
    * Adicionados tipos explícitos para props e estado dos componentes.
6.  **Modularizar e Organizar**:
    * Corrigida a estrutura de roteamento em `App.tsx` para lidar adequadamente com diferentes layouts para sub-rotas de `/app/*`.
    * Padronizadas as interações com a API para usar a API `fetch` através da camada `models`, removendo o uso direto de `axios` dos componentes.
    * Corrigido o nome do componente dentro de `src/pages/audiences.tsx` para `AudiencesPage` para corresponder à sua funcionalidade e rota.
    * Configurada a URL base da API usando as variáveis de ambiente do Vite (`import.meta.env.VITE_API_BASE_URL`).
7.  **Adicionar Testes Unitários**:
    * Implementados novos testes unitários usando Vitest e React Testing Library para componentes chave e funções utilitárias para atingir aproximadamente 50% de cobertura.
    * Foco em testar a renderização de componentes, interações do usuário e mudanças de estado.
8.  **Implementar Interface Fluente**:
    * Introduzido um padrão builder para construir o `SendCampaignDTO` em `src/models/campaigns.ts` para demonstrar uma interface fluente onde ela provê clareza para a criação de objetos complexos.

## ChangeLog

Veja [CHANGELOG.md](CHANGELOG.md).

## Descrição dos Testes Implementados

Testes unitários foram implementados usando Vitest e React Testing Library. O foco foi cobrir componentes e lógicas críticas para garantir confiabilidade e facilitar refatorações futuras.

* **`src/pages/login.test.tsx`**:
    * Testa a renderização dos campos do formulário de login (email, senha).
    * Simula a entrada do usuário e a submissão do formulário.
    * Verifica se o callback `onSuccessfulLogin` é chamado com as credenciais mock corretas.
* **`src/pages/audiences.test.tsx`**:
    * Testa a renderização da lista de contatos.
    * Testa a adição de um novo contato: simula entrada, clica em "adicionar" e verifica se o novo contato aparece.
    * Testa a exclusão de um contato: simula o clique no botão de deletar e verifica se o contato é removido da lista.
    * Testa a edição de um contato: simula o clique em "editar", alteração de valores, salvamento e verifica a atualização.
* **`src/components/common/MonacoEditorComponent.test.tsx`**:
    * Testa se o wrapper do Monaco Editor renderiza corretamente com o conteúdo inicial.
    * Verifica se o callback `onContentChange` é disparado quando o conteúdo do editor muda.
* **`src/models/campaigns.test.ts` (Teste do Builder)**:
    * Testa o `SendCampaignDTOBuilder` para a construção correta do DTO.
    * Verifica se o builder define corretamente o nome da campanha, ID do template, contatos, segmentos e informações de agendamento.
    * Garante que o método `build()` produz um DTO que está em conformidade com o `sendCampaignSchema`.
* **`src/hooks/useApiFeedback.test.ts`**:
    * Testa o hook `useApiFeedback` para gerenciar estados de feedback (sucesso, erro, aviso).
    * Verifica o estado inicial e as transições de estado ao chamar as funções manipuladoras.

Esses testes cobrem interações de UI, gerenciamento de estado dentro dos componentes e a lógica de hooks utilitários e builders, visando a cobertura solicitada de ~50% dos caminhos críticos.

## Descrição da Implementação da Interface Fluente

Uma interface fluente foi implementada usando o **Padrão Builder** para o `SendCampaignDTO` localizado em `src/models/campaigns.ts`.

**Motivação**: O objeto `SendCampaignDTO` possui diversos campos, incluindo objetos aninhados (`sendTo`, `schedule`) e arrays, com algumas partes sendo opcionais (como `schedule.cron`). Construir este objeto diretamente pode ser verboso e propenso a erros. Um builder fornece uma maneira passo a passo, legível e segura em termos de tipo para criar este DTO.

**Implementação**:
Uma classe `SendCampaignDTOBuilder` foi criada com:
* Um construtor para inicializar campos obrigatórios (`campaignName`, `templateId`).
* Métodos para cada grupo de propriedades (ex.: `withCampaignName()`, `addContact()`, `addSegment()`, `withSchedule()`).
* Cada método retorna `this`, permitindo o encadeamento de métodos (fluidez).
* Um método `build()` que valida o DTO construído contra o `sendCampaignSchema` (usando o método `parse` do Zod) e retorna o DTO final.

**Exemplo de Uso**:
```typescript
import { SendCampaignDTOBuilder } from './campaigns';

const campaignData = new SendCampaignDTOBuilder("Promoção de Verão", "template-uuid-123")
  .addContact("contact-uuid-456")
  .addSegment("segment-uuid-789")
  .withSchedule(new Date().toISOString()) // Exemplo apenas com dateTime
  .build();

// Use campaignData com a função do modelo sendCampaign
// await sendCampaign(campaignData);
```
Esta abordagem torna a criação do `SendCampaignDTO` mais declarativa e fácil de gerenciar, especialmente se mais campos opcionais ou configurações complexas forem adicionados no futuro.

## Descrição da Instalação e Execução

### Pré-requisitos

* Node.js (v16 ou posterior recomendado)
* npm ou yarn

### Instalação

1.  Clone o repositório:
    ```bash
    git clone <repository-url>
    cd jyula-email-frontend-clean-code
    ```
2.  Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  Crie um arquivo `.env` na raiz do projeto e configure a variável de ambiente para a URL da API:
    ```env
    VITE_API_BASE_URL=http://localhost:8080
    ```

### Execução

1.  **Para desenvolvimento (com Hot Reloading)**:
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta, se especificada).

2.  **Para build de produção**:
    ```bash
    npm run build
    # ou
    yarn build
    ```
    Os arquivos de build serão gerados no diretório `dist/`.

3.  **Para visualizar a build de produção localmente**:
    ```bash
    npm run preview
    # ou
    yarn preview
    ```

4.  **Para rodar os testes (Vitest)**:
    ```bash
    npm run test
    # ou
    yarn test
    ```
    Para rodar os testes em modo watch:
    ```bash
    npm run test:watch
    # ou
    yarn test:watch
    ```

5.  **Para rodar testes End-to-End (Cypress)**:
    Para abrir a interface do Cypress:
    ```bash
    npm run cypress:open
    # ou
    yarn cypress:open
    ```
    (Nota: A configuração e os testes do Cypress não foram o foco principal desta refatoração, mas os scripts existentes permanecem).

6.  **Linting e Formatação**:
    Para verificar o linting:
    ```bash
    npm run lint
    # ou
    yarn lint
    ```
    Para verificar a formatação com Prettier:
    ```bash
    npm run lint:check
    # ou
    yarn lint:check
    ```
    Para corrigir a formatação com Prettier:
    ```bash
    npm run lint:fix
    # ou
    yarn lint:fix
    ```
```