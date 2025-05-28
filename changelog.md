# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (a partir desta refatoração).

## [1.0.0-refactor] - 2025-05-27

Esta versão marca uma refatoração significativa do codebase com foco em Clean Code, melhor organização, tipagem e testabilidade.

### Added

* **Testes Unitários**:
    * Adicionados testes para `src/pages/login.tsx` cobrindo renderização e submissão de formulário.
    * Adicionados testes para `src/pages/audiences.tsx` cobrindo CRUD de contatos.
    * Adicionados testes para o componente reutilizável `src/components/common/MonacoEditorComponent.tsx`.
    * Adicionados testes para o builder `SendCampaignDTOBuilder` em `src/models/campaigns.test.ts`.
    * Adicionados testes para o hook `src/hooks/useApiFeedback.test.ts`.
* **`src/components/common/MonacoEditorComponent.tsx`**: Componente reutilizável para o editor Monaco, consolidando a lógica anteriormente duplicada.
* **`src/hooks/useApiFeedback.ts`**: Hook customizado para gerenciar o estado de feedback de API (Snackbar/Alerts).
* **`src/models/campaigns.ts`**: Implementado `SendCampaignDTOBuilder` para construção fluente de DTOs de campanha.
* **`.env.example`**: Arquivo de exemplo para variáveis de ambiente.
* Adicionado este `CHANGELOG.md`.
* Atualizado `README.md` com descrição detalhada do projeto, análise de problemas, estratégia de refatoração e guias de instalação/execução.

### Changed

* **Nomenclatura e Organização**:
    * Renomeado `src/components/templatesComponents/ViwerMonacoTemplate.jsx` para `src/components/templatesComponents/ViewerMonacoAdapter.tsx` (para distinguir do componente de página `src/pages/viewerTemplate.tsx`).
    * Renomeado `src/components/templatesComponents/MonacoEditor.jsx` para `src/components/common/MonacoEditorComponent.tsx` e tornado genérico.
    * Convertidos todos os arquivos `.jsx` para `.tsx` (`DefaultLayout.tsx`, `ToolBarLayout.tsx`, `LayoutSearchBar.tsx`, `LayoutToolBar.tsx`, `ExampleTemplate.ts` - pois não usa JSX).
    * Renomeado o componente interno em `src/pages/audiences.tsx` de `CreateCampaign` para `AudiencesPage`.
    * Corrigido nome do arquivo `vitest.conifg.ts` para `vitest.config.ts`.
* **Separação de Responsabilidades**:
    * Refatoradas as páginas `createTemplates.tsx` e `viewerTemplate.tsx` para utilizar o `useApiFeedback` hook.
    * Interações de API (anteriormente `axios` direto nos componentes) agora devem ser canalizadas através das funções nos diretórios `src/models/`. (Nota: os modelos já usavam `fetch`, a mudança é garantir que os componentes usem os modelos).
* **Tipagem TypeScript**:
    * Adicionadas tipagens explícitas para props e estado em todos os componentes convertidos para `.tsx`.
* **Gerenciamento de Estado**:
    * Utilizado o hook `useApiFeedback` para gerenciar estados de `loading`, `error`, `success` e mensagens de Snackbar em `createTemplates.tsx` e `viewerTemplate.tsx`.
* **Tratamento de Erros**:
    * Modelos foram implicitamente melhorados ao serem chamados por componentes que agora usam `useApiFeedback`, permitindo uma melhor propagação e exibição de erros.
* **Configuração**:
    * Atualizados os arquivos de modelo (`contacts.ts`, `campaigns.ts`, etc.) para usar `import.meta.env.VITE_API_BASE_URL` em vez de `process.env.BASE_URL` ou URL hardcoded.
* **Roteamento (`App.tsx`)**:
    * Corrigida a duplicação de rotas `/app/*`. As rotas agora são aninhadas corretamente sob `DefaultLayout` e `ToolBarLayout` usando `Outlet` de forma mais clara.
* **Componentes**:
    * `MonacoEditorComponent.tsx` agora aceita `initialContent` e `onContentChange` como props.
    * `ExampleTemplate.ts` agora é um arquivo `.ts` que exporta uma função retornando a string do template.

### Removed

* Removido `src/components/templatesComponents/ViewerMonacoTemplate.jsx` (funcionalidade integrada e substituída por `MonacoEditorComponent.tsx` e adaptada em `viewerTemplate.tsx`).
* Removido `src/components/templatesComponents/MonacoEditor.jsx` (substituído por `MonacoEditorComponent.tsx`).
* Removido uso direto de `axios` nos componentes (`createTemplates.tsx`, `viewerTemplate.tsx`); eles agora dependem de funções de modelo (que usam `fetch`).

### Fixed

* Corrigida a estrutura de roteamento em `App.tsx` para evitar conflitos e garantir que os layouts corretos sejam aplicados às sub-rotas de `/app`.
* Consistência no uso do `MonacoEditorComponent` nas páginas `createTemplates.tsx` e `viewerTemplate.tsx`.

- Arquivo de configuração `google_checks.xml` com regras de estilo do Google
- Plugin Maven CheckStyle na versão 3.2.1
- Verificação automática de estilo durante a fase de validação do Maven
- Testes unitários para serviços e entidades principais:
  - `SegmentServiceTest`: Testes para operações CRUD de segmentos
  - `ContactServiceTest`: Testes para gerenciamento de contatos
  - `CampaignServiceTest`: Testes para criação e envio de campanhas
  - `UserServiceTest`: Testes para autenticação e gerenciamento de usuários



### Detalhes Técnicos

- Implementadas regras para:
  - Convenções de nomenclatura
  - Importações
  - Violações de tamanho (métodos, parâmetros)
  - Espaçamento e formatação
  - Números mágicos
  - Modificadores de visibilidade
- Implementação de testes:
  - Uso de Mockito para mock de dependências
  - Testes de integração com banco de dados em memória (H2)

