# Pink Dog — Next.js Fullstack (App Router)

Sistema de gestão para clínica veterinária e petshop.

## Estrutura

```
web/
├── prisma/
│   ├── schema.prisma      # Schema do banco (SQLite dev / PostgreSQL prod)
│   └── seed.ts            # Dados iniciais
├── src/
│   ├── lib/prisma.ts      # Singleton PrismaClient
│   └── app/
│       ├── page.tsx         # Landing page
│       ├── layout.tsx       # Root layout + fontes
│       ├── admin/page.tsx   # Dashboard administrativo
│       ├── staff/page.tsx   # Painel operacional (Kanban)
│       ├── login/page.tsx   # Tela de login
│       └── api/
│           ├── clients/route.ts
│           ├── pets/route.ts
│           ├── services/route.ts
│           ├── appointments/route.ts
│           ├── staff/route.ts
│           ├── dashboard/stats/route.ts
│           └── auth/login/route.ts
```

## Como rodar

### 1. Instalar dependências
```bash
cd web
npm install
```

### 2. Instalar Prisma CLI (se necessário)
```bash
npm install -D prisma@5
npm install @prisma/client@5
```

### 3. Criar banco e rodar migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Popular com dados de teste
```bash
npx prisma db seed
```

### 5. Iniciar servidor
```bash
npm run dev
```

Acesse:
- Landing: http://localhost:3000
- Admin:   http://localhost:3000/admin
- Staff:   http://localhost:3000/staff
- Login:   http://localhost:3000/login

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST | /api/clients | Tutores (busca inclusa) |
| GET/POST | /api/pets | Pets por tutor |
| GET/POST | /api/services | Catálogo de serviços |
| GET/POST | /api/appointments | Agendamentos |
| PATCH | /api/appointments | Atualizar status/etapa |
| GET/PATCH | /api/staff | Funcionários e permissões |
| GET | /api/dashboard/stats | Estatísticas do dia |
| POST | /api/auth/login | Autenticação |

## Banco de Dados

SQLite em desenvolvimento (`file:./dev.db`).
Para produção, altere `provider = "sqlite"` para `"postgresql"` no `schema.prisma` e use `Decimal @db.Decimal(10,2)` nos campos de preço.

## Entidades

- **User/Staff**: autenticação, setores (SPA/VET/GERAL), permissões operacionais
- **Client**: tutores com busca por nome/telefone/pet
- **Pet**: pacientes com alertas médicos e histórico
- **Service**: catálogo com preços e duração
- **Appointment**: pipeline completo (espera → execução → acabamento → pronto)
- **MedicalRecord**: prontuário clínico com anexos
- **Product/Inventory**: controle de estoque (vacinas, shampoos, etc.)
- **NotificationLog**: log de disparos WhatsApp/SMS
