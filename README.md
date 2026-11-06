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
├── web/                    # Aplicação principal (Next.js)
│   ├── prisma/             # Schema e seed do banco
│   ├── src/app/            # Rotas e páginas
│   │   ├── page.tsx        # Landing page
│   │   ├── admin/          # Dashboard administrativo
│   │   ├── staff/          # Painel operacional (Kanban)
│   │   ├── login/          # Autenticação
│   │   └── api/            # Endpoints REST
│   └── public/             # Assets estáticos
├── backend/                # Configurações e schema de referência
├── assets/                 # Imagens e mídias do projeto
└── referencias/            # HTMLs de referência de UI
```

## Funcionalidades principais

- **Gestão de tutores e pets**: cadastro, busca e histórico
- **Agendamentos**: pipeline completo com etapas (espera → execução → acabamento → pronto)
- **Prontuário clínico**: registros médicos com anexos
- **Controle de estoque**: produtos, movimentações e alertas de reposição
- **RH / Staff**: funcionários, setores (SPA, VET, GERAL) e permissões operacionais
- **Dashboard**: estatísticas e acompanhamento em tempo real
- **Autenticação**: login com controle de acesso por perfil

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
- Landing: http://localhost:3000
- Admin:   http://localhost:3000/admin
- Staff:   http://localhost:3000/staff
- Login:   http://localhost:3000/login

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST | /api/clients | Tutores |
| GET/POST | /api/pets | Pets |
| GET/POST | /api/services | Catálogo de serviços |
| GET/POST | /api/appointments | Agendamentos |
| PATCH | /api/appointments | Atualizar status/etapa |
| GET/PATCH | /api/staff | Funcionários |
| GET | /api/dashboard/stats | Estatísticas |
| POST | /api/auth/login | Login |

## Entidades

- **User/Staff**: autenticação e permissões
- **Client**: tutores
- **Pet**: pacientes com alertas médicos
- **Service**: catálogo de serviços e preços
- **Appointment**: agendamentos com pipeline operacional
- **MedicalRecord**: prontuários clínicos
- **Product/Inventory**: estoque e movimentações
- **NotificationLog**: log de notificações

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
- Botões com `type="button"`, links whatsapp com `rel="noopener noreferrer"`

## O que ficou para a proxima

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
