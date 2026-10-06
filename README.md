# Sistema de Extintores (Angular)

## Executar localmente

Esta configuração usa Angular 14 e é compatível com Node.js 14.15 ou superior na linha 14 e Node.js 16.10 ou superior na linha 16.

1. Instale as dependências com `npm install`.
2. Inicie a aplicação com `npm start`.
3. Acesse o endereço informado pelo Angular CLI (normalmente `http://localhost:4200`).

O front-end usa a API em `http://localhost:8080`, como na versão anterior. A API deve estar ativa para autenticação e operações de cadastro/listagem.

## Build

Execute `npm run build` para gerar a aplicação de produção em `dist/sistema-extintores-front`.

## Organização da aplicação

As páginas são componentes Angular separados e agrupados por funcionalidade em `src/app/components/`:

- `home/` e `login/`: painel inicial e autenticação.
- `categorias/`: listagem e formulário de categorias.
- `localizacoes/`: listagem e formulário de localizações.
- `extintores/`: listagem e formulário de extintores.
- `movimentacoes/`: listagem, formulário, itens e formulário de item.
- `shared/`: tipos compartilhados da API e formatadores de data/status.
- `api.service.ts`: cliente HTTP comum, incluindo o token de autenticação.

O `AppComponent` é o shell: mantém o menu lateral, identifica a tela de login para ocultar o menu e carrega o CSS legado correspondente à URL. O `RouterOutlet` recebe o componente definido em `app.routes.ts`; cada tela busca/salva seus próprios dados usando `ApiService`.

### Rotas e telas

| URL | Tela / comportamento |
| --- | --- |
| `/` | Redireciona para `/home`. |
| `/home` | Painel com atalhos para as quatro áreas principais. |
| `/login` | Autentica na API; o token recebido é salvo no navegador. |
| `/categorias` | Lista, filtra, edita e exclui categorias. |
| `/categorias/nova` | Cria categoria; `?id=...` carrega a categoria para edição. |
| `/localizacoes` | Lista, filtra, edita e exclui localizações. |
| `/localizacoes/nova` | Cria localização; `?id=...` carrega a localização para edição. |
| `/extintores` | Lista, filtra, edita e exclui extintores. |
| `/extintores/novo` | Cria extintor; `?numero=...` carrega o registro para edição. |
| `/movimentacoes` | Lista, filtra, edita e exclui movimentações; permite abrir seus itens. |
| `/movimentacoes/nova` | Cria movimentação; `?id=...` carrega a movimentação para edição. |
| `/movimentacoes/itens?movimentoId=...` | Lista apenas os itens da movimentação selecionada. |
| `/movimentacoes/itens/novo?movimentoId=...` | Cria um item associado à movimentação; `&itemId=...` carrega um item para edição. |

Os endereços antigos terminados em `.html` continuam registrados como redirecionamentos para as rotas Angular correspondentes.
