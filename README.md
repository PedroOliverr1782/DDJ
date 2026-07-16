# API de Gerenciamento de Usuários

API REST desenvolvida em NestJS para gerenciamento de usuários, com autenticação via JWT, CRUD completo e persistência de dados com Prisma ORM.

## Tecnologias utilizadas

- [NestJS](https://nestjs.com/) — framework Node.js/TypeScript
- [Prisma ORM](https://www.prisma.io/) (v6) — camada de acesso ao banco de dados
- SQLite — banco de dados (arquivo local, sem necessidade de servidor)
- JWT (`@nestjs/jwt` + `passport-jwt`) — autenticação baseada em token
- `bcryptjs` — criptografia de senha
- `class-validator` / `class-transformer` — validação dos dados de entrada

## Pré-requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
git clone https://github.com/PedroOliverr1782/DDJ.git
cd DDJ/user-management
npm install
```

## Configuração das variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus próprios valores:

```bash
cp .env.example .env
```

O `.env` precisa conter:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="uma-string-secreta-grande-e-aleatoria"
JWT_EXPIRES_IN="1h"
```

> Dica: gere uma string aleatória segura para o `JWT_SECRET` com:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

## Criando o banco de dados

Este comando cria o arquivo do banco SQLite e aplica o schema definido em `prisma/schema.prisma`:

```bash
npx prisma migrate dev
```

## Rodando o projeto

```bash
npm run start:dev
```

A API sobe em `http://localhost:3000`.

## Endpoints

| Método | Rota | Protegida? | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Não | Cadastra um novo usuário |
| POST | `/auth/login` | Não | Autentica e retorna um token JWT |
| GET | `/users` | Sim | Lista todos os usuários |
| GET | `/users/:id` | Sim | Busca um usuário pelo id |
| PATCH | `/users/:id` | Sim | Edita dados de um usuário |
| DELETE | `/users/:id` | Sim | Remove um usuário |

Rotas marcadas como "protegidas" exigem o header:
```
Authorization: Bearer <token>
```

### Exemplo — Registro

```
POST /auth/register
Content-Type: application/json

{
  "name": "Pedro Teste",
  "email": "pedro@teste.com",
  "password": "123456"
}
```

### Exemplo — Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "pedro@teste.com",
  "password": "123456"
}
```

Resposta:
```json
{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

## Segurança

- Senhas são criptografadas com `bcryptjs` antes de serem salvas — nunca em texto puro.
- A senha nunca é retornada em nenhuma resposta da API.
- Todas as rotas de `/users` exigem um token JWT válido, validado por um Guard.
- Mensagens de erro de login não revelam se o e-mail existe ou não, para evitar enumeração de usuários cadastrados.
