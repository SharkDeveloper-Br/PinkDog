# PinkDog

Sistema de gestão completo para clínica veterinária e petshop.

## Sobre o projeto

PinkDog é uma aplicação fullstack para administração de clínicas veterinárias e petshops, cobrindo desde o agendamento de serviços até o controle de estoque e prontuários clínicos.

## Tecnologias

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: API Routes do Next.js
- **Banco de dados**: Prisma ORM com SQLite (desenvolvimento)
- **Containerização**: Docker Compose (configuração disponível)

## Estrutura

```
pinkDog/
├─── web/                    # Aplicação principal (Next.js)
│   ├─── prisma/             # Schema, migrations e seed do banco
│   ├─── src/app/            # Rotas e páginas
│   │   ├─── page.tsx        # Landing page (com barra de acesso do tutor)
│   │   ├─── cadastro/       # Cadastro público de tutor + pet
│   │   ├─── cliente/        # Dashboard do tutor (protegido)
│   │   ├─── login/          # Login dual (cliente / funcionário)
│   │   ├─── admin/          # Dashboard administrativo
│   │   ├─── staff/          # Painel operacional (Kanban)
│   │   └─── api/            # Endpoints REST
│   └─── public/             # Assets estáticos
├─── backend/                # Schema de referência (Prisma)
├─── assets/                 # Imagens e mídias do projeto
└─── referencias/            # HTMLs de referência de UI
```

## Funcionalidades principais

- **Cadastro público de tutor e pet**: formulário brutalista com live preview de ticket rosa
- **Login dual**: clientes (por email/telefone) e funcionários (por email) na mesma tela
- **Dashboard do tutor**: área protegida com dados pessoais, lista de pets e ações rápidas
- **Gestão de tutores e pets**: cadastro, busca e histórico (painel staff/admin)
- **Agendamentos**: pipeline completo com etapas (espera → execução → acabamento → pronto)
- **Prontuário clínico**: registros médicos com anexos
- **Controle de estoque**: produtos, movimentações e alertas de reposição
- **RH / Staff**: funcionários, setores (SPA, VET, GERAL) e permissões operacionais
- **Dashboard administrativo**: estatísticas e acompanhamento em tempo real
- **Autenticação**: JWT com cookie HttpOnly, controle de acesso por role

## Como rodar

### 1. Instalar dependências
```bash
cd web
npm install
```

### 2. Configurar o banco de dados
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Popular dados de teste
```bash
npx prisma db seed
```

### 4. Iniciar o servidor
```bash
npm run dev
```

Acesse:
- Landing:  http://localhost:3000
- Cadastro: http://localhost:3000/cadastro
- Login:    http://localhost:3000/login
- Cliente:  http://localhost:3000/cliente
- Admin:    http://localhost:3000/admin
- Staff:    http://localhost:3000/staff

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST | /api/clients | Tutores (painel admin) |
| GET/POST | /api/pets | Pets (painel admin) |
| GET/POST | /api/services | Catálogo de serviços |
| GET/POST | /api/appointments | Agendamentos |
| PATCH | /api/appointments | Atualizar status/etapa |
| GET/PATCH | /api/staff | Funcionários |
| GET | /api/dashboard/stats | Estatísticas |
| POST | /api/auth/register | Cadastro público (tutor + pet) |
| POST | /api/auth/login | Login dual (cliente / funcionário) |
| POST | /api/auth/logout | Encerrar sessão |
| GET | /api/me | Dados do usuário logado com pets |

## Entidades

- **User/Staff**: autenticação e permissões
- **Client**: tutores
- **Pet**: pacientes com alertas médicos
- **Service**: catálogo de serviços e preços
- **Appointment**: agendamentos com pipeline operacional
- **MedicalRecord**: prontuários clínicos
- **Product/Inventory**: estoque e movimentações
- **NotificationLog**: log de notificações

## O que foi feito (09/11/2026)

### Fluxo de cadastro e login do tutor
- Cadastro publico de tutor + pet em `/cadastro` (form brutalista com live preview)
- Login dual: clientes logam com email ou telefone; funcionarios com email
- JWT com `role=CLIENT` para tutores autenticados
- Dashboard do tutor em `/cliente` (protegido, exibe dados e pets)
- API `POST /api/auth/register` cria Client + Pet atomico e emite cookie
- API `POST /api/auth/login` tenta `User` (staff) primeiro, depois `Client`
- API `GET /api/me` retorna dados do logado com pets incluidos
- API `POST /api/auth/logout` limpa o cookie de sessao
- Middleware atualizado com paths publicos: `/`, `/cadastro`, `/api/auth/register`

### Schema
- `Client.password` para autenticacao de tutores
- `Client.phone` como `@unique` para login por telefone
- `Pet.preferredSector` (SPA/VET/GERAL) para ala de atendimento inicial

## O que foi feito (06/11/2026)

### Seguranca
- Autenticacao real com JWT (jose) e bcrypt - login valida senha e emite cookie HttpOnly
- Middleware de protecao em todas as rotas (redireciona para /login se nao autenticado)
- Autorizacao por role (RBAC) - /api/staff restringido a ADMIN
- Validacao de input com Zod em TODAS as APIs
- Headers de seguranca: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Seed com senhas hasheadas e limpeza idempotente

### Qualidade
- Tratamento de erro em todas as APIs (try/catch + mapeamento Prisma -> HTTP)
- Tipos TypeScript reais para todas as entidades (`src/lib/types.ts`)
- Removido `any` dos componentes principais
- Schema Prisma corrigido (enums -> String para SQLite, relacao StaffMember corrigida)
- Redirecionamento por role no login (admin -> /admin, staff -> /staff)
- Botoes com `type="button"`, links whatsapp com `rel="noopener noreferrer"`

## O que ficou para a proxima

- [ ] Agendamento online pelo dashboard do tutor
- [ ] Cadastro de pet adicional para tutor ja logado
- [ ] Recuperacao de senha (cliente e funcionario)
- [ ] Rate limiting (login e APIs) - precisa Redis/Upstash
- [ ] Audit logging - tabela de logs para acoes criticas
- [ ] Testes unitarios (Vitest/Jest) e E2E (Playwright)
- [ ] Migrar SQLite -> PostgreSQL para producao
- [ ] Content-Security-Policy com regras strict
- [ ] CSRF token dedicado (alem do SameSite=Strict)
- [ ] Remover diretorio `backend/` (schema duplicado) ou extrair API separada
- [ ] Limpar secrets do historico Git (BFG Repo-Cleaner)
- [ ] Migrar middleware.ts para proxy.ts (Next.js 16)

## Licença

ISC
