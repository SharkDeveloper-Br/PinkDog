
================================================================================
PINKDOG - RELATORIO COMPLETO DE SEGURANCA, QA & VULNERABILIDADES
================================================================================
Data: 2026-11-06
Projeto: PinkDog - Sistema de Gestao para Clinica Veterinaria e Petshop
Stack: Next.js 16 + React 19 + Prisma ORM + SQLite + Tailwind CSS v4
Autor da analise: Hermes Agent
================================================================================


============================================
1. RESUMO EXECUTIVO
============================================

SEVERIDADE Geral: ALTA (multiplas falhas criticas de seguranca ativas)

O sistema possui uma base arquitetural razoavel (Prisma ORM, App Router do
Next.js), mas carece COMPLETAMENTE de camadas de seguranca essenciais:
- Autenticacao ficticia (login nao valida senha)
- Zero autorizacao nas APIs (qualquer um acessa dados)
- Zero validacao de input
- Zero protecao contra injecao (embora Prisma mitigue SQLi direta)
- Dados sensiveis expostos em .env nao ignorado corretamente
- Seed com credenciais de teste em plaintext no historico Git

Status: NAO SEGURO PARA PRODUCAO EM HIPOTESE ALGUMA.


============================================
2. VULNERABILIDADES DE SEGURANCA
============================================

--------------------------------------------------------------------------------
[CRITICA] AUTH-001 - Login nao valida senha (Bypass total de autenticacao)
--------------------------------------------------------------------------------
Arquivo: web/src/app/api/auth/login/route.ts
Linha: 4-11

Codigo vulneravel:
  const { email, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return ... 401
  return NextResponse.json({ id: user.id, email: user.email, ... })

Problema: O parametro 'password' e recebido mas NUNCA comparado. Qualquer
email valido retorna sucesso, independentemente da senha.

Impacto: Acesso total como admin, vet ou groomer sem saber a senha.

Mitigacao:
  1. Implementar bcrypt.compare(password, user.password)
  2. Usar NextAuth.js v5 (Auth.js) ou implementar JWT + session cookie
  3. Configurar cookie HttpOnly, Secure, SameSite=Strict

--------------------------------------------------------------------------------
[CRITICA] AUTH-002 - Zero autorizacao em TODAS as APIs
--------------------------------------------------------------------------------
Arquivos: TODOS os route.ts em web/src/app/api/*

NENHUMA rota verifica se o usuario esta autenticado ou autorizado.

Exemplos:
- GET /api/clients -> expoe dados PII de tutores sem login
- GET /api/staff   -> expoe dados de funcionarios
- PATCH /api/staff -> qualquer um altera permissoes de funcionarios
- POST /api/appointments -> qualquer um cria agendamentos

Impacto: Vazamento de dados pessoais (LGPD), elevacao de privilegio,
manipulacao nao autorizada de registros clinicos.

Mitigacao:
  1. Criar middleware de autenticacao (Next.js middleware.ts)
  2. Verificar session/JWT em cada route handler
  3. Implementar RBAC (Role-Based Access Control) baseado em UserRole

--------------------------------------------------------------------------------
[CRITICA] AUTH-003 - Sem protecao CSRF nas mutacoes
--------------------------------------------------------------------------------
Arquivos: web/src/app/api/*/route.ts (POST, PATCH)

Fetch calls do frontend nao incluem token CSRF. APIs nao verificam
Origin/Referer nem usam padrao de duplo-cookie.

Impacto: Ataques CSRF permitem que sites maliciosos criem/modifiquem
agendamentos, editem staff ou excluam dados em nome de usuario logado.

Mitigacao:
  - Next.js App Router com Server Actions mitiga parcialmente
  - Para APIs REST manuais, adicionar header X-CSRF-Token validado no servidor

--------------------------------------------------------------------------------
[ALTA] INJ-001 - Type confusion e Prisma query injection via 'any'
--------------------------------------------------------------------------------
Arquivo: web/src/app/api/appointments/route.ts
Linha: 10

  const where: any = {}

Problema: O uso de 'any' desabilita verificacao de tipo. O objeto 'where'
e construido dinamicamente a partir de query params sem sanitizacao.

Embora Prisma parameterize queries SQL (mitigando SQLi tradicional),
o uso de 'any' permite que campos inesperados sejam injetados no filtro,
potencialmente vazando dados via query complexa (ex: include malicioso).

Impacto: Potencial vazamento de dados, comportamento imprevisivel do ORM.

Mitigacao:
  - Tipar estritamente com Prisma.AppointmentWhereInput
  - Validar todos os parametros com Zod antes de passar ao Prisma

--------------------------------------------------------------------------------
[ALTA] INJ-002 - Injecao de objetos no POST/PUT via JSON nao validado
--------------------------------------------------------------------------------
Arquivos:
  - web/src/app/api/appointments/route.ts (POST)
  - web/src/app/api/clients/route.ts (POST)
  - web/src/app/api/pets/route.ts (POST)
  - web/src/app/api/services/route.ts (POST)
  - web/src/app/api/staff/route.ts (PATCH)

NENHUM endpoint valida o body da requisicao. Exemplo:

  const body = await req.json()
  const appointment = await prisma.appointment.create({ data: { ...body } })

Impacto:
  - Injecao de campos nao permitidos
  - Sobrescrita de valores protegidos (id, createdAt, etc.)
  - Potencial NoSQL-like injection em campos JSON

Mitigacao:
  - Usar Zod schemas para validar TODO input de API
  - Construir objetos data explicitamente com campos permitidos

--------------------------------------------------------------------------------
[ALTA] DATA-001 - Dados PII expostos sem autenticacao
--------------------------------------------------------------------------------
Arquivos:
  - web/src/app/api/clients/route.ts
  - web/src/app/api/dashboard/stats/route.ts

Clientes retornam: nome, telefone, email, CPF, endereco, pets.
Tudo sem exigir login.

Impacto: Violacao direta da LGPD (Lei 13.709/2018). Multas de ate 2% do
faturamento. Exposicao de CPF e dados de contato.

Mitigacao:
  - Exigir autenticacao em TODAS as rotas administrativas
  - Implementar middleware de autorizacao

--------------------------------------------------------------------------------
[ALTA] DATA-002 - Credenciais e secrets em .env versionados
--------------------------------------------------------------------------------
Arquivos:
  - backend/.env (DATABASE_URL)
  - web/.env (DATABASE_URL, NEXTAUTH_SECRET)

Problema: Ambos os arquivos .env estao versionados no Git (confirmado por
git status mostrando modificacoes). O .gitignore lista .env, mas os arquivos
ja foram commitados anteriormente.

Impacto: Vazamento de secrets no historico do Git. NEXTAUTH_SECRET exposto.

Mitigacao:
  1. Remover do Git: git rm --cached backend/.env web/.env
  2. Forcar rotacao de NEXTAUTH_SECRET imediatamente
  3. Usar .env.example para templates
  4. Verificar com git log --all --full-history -p -- backend/.env

--------------------------------------------------------------------------------
[ALTA] CORS-001 / CORS-002 - Falta configuracao de CORS e headers de seguranca
--------------------------------------------------------------------------------
Arquivo: web/next.config.ts

O next.config.ts nao define headers de seguranca:
- Content-Security-Policy (ausente)
- X-Frame-Options (ausente)
- X-Content-Type-Options (ausente)
- Strict-Transport-Security (ausente)
- Referrer-Policy (ausente)

Impacto:
  - Clickjacking (site embutido em iframe malicioso)
  - XSS via inline scripts
  - MIME-sniffing attacks

Mitigacao:
  Adicionar headers no next.config.ts:
    async headers() {
      return [{
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; ..." },
        ]
      }]
    }

--------------------------------------------------------------------------------
[MEDIA] XSS-001 - Renderizacao de dados nao sanitizados no cliente
--------------------------------------------------------------------------------
Arquivo: web/src/app/admin/hr/page.tsx
Linha: 158

  <a href={`https://wa.me/55${cli.phone.replace(/\D/g, '')}`} ...>

Problema: 'cli.phone' vem do backend sem sanitizacao. Se um atacante
injetar JavaScript no campo phone (via POST /api/clients sem validacao),
pode haver execucao de codigo no contexto da pagina.

Embora React escape conteudo por padrao, atributos como href podem conter
javascript: URLs.

Impacto: XSS refletido/armazenado.

Mitigacao:
  - Validar e sanitizar todos os inputs antes de persistir
  - Usar biblioteca como DOMPurify se precisar renderizar HTML

--------------------------------------------------------------------------------
[MEDIA] IDOR-001 - Acesso direto a recursos sem verificacao de ownership
--------------------------------------------------------------------------------
Arquivos: Todos os endpoints GET/PATCH

Exemplo: GET /api/appointments?petId=XYZ retorna dados de qualquer pet,
sem verificar se o usuario logado tem permissao para aquele pet.

Impacto: Insecure Direct Object Reference - usuario A ve dados do usuario B.

Mitigacao:
  - Verificar ownership do recurso antes de retornar
  - Aplicar filtros de escopo baseados no usuario autenticado

--------------------------------------------------------------------------------
[MEDIA] LOG-001 - Falta de logging e rate limiting
--------------------------------------------------------------------------------
Arquivos: Todas as APIs

- Sem rate limiting (susceptivel a brute force no login)
- Sem logs de auditoria para acoes criticas (alteracao de staff,
  pagamentos, prontuarios medicos)

Impacto:
  - Ataques de forca bruta no login sem deteccao
  - Impossibilidade de investigacao forense em caso de incidente

Mitigacao:
  - Implementar rate limiting (ex: next-rate-limit, upstash)
  - Adicionar tabela de AuditLog para acoes criticas

--------------------------------------------------------------------------------
[BAIXA] INFO-001 - Stack traces e informacoes de debug expostos
--------------------------------------------------------------------------------
Arquivo: web/next.config.ts
Linha: 5-6

  cacheComponents: true,
  partialPrefetching: true,

Problema: Se houver erro no servidor, Next.js em modo dev expoe stack traces.
Nao ha tratamento global de erros nas APIs.

Impacto: Vazamento de paths internos, nomes de arquivos, estrutura do projeto.

Mitigacao:
  - Implementar error boundary global
  - Tratar excecoes nos route handlers com try/catch padronizado


============================================
3. QUALIDADE DE CODIGO (QA)
============================================

--------------------------------------------------------------------------------
[Q-CRITICA] Code Smell: Uso excessivo de 'any'
--------------------------------------------------------------------------------
Arquivos afetados:
  - web/src/app/admin/page.tsx: useState<any>(null), useState<any[]>([])
  - web/src/app/admin/hr/page.tsx: useState<any[]>([]), useState<any>(null)
  - web/src/app/staff/page.tsx: useState<any[]>([])
  - web/src/app/api/appointments/route.ts: const where: any = {}

Problema: O uso de 'any' em TypeScript anula todos os beneficios de tipo.
Dificulta refatoracao, permite bugs silenciosos e reduz DX.

Mitigacao: Definir interfaces/types para todas as entidades e usar
Prisma-generated types (ex: Prisma.AppointmentGetPayload<...>).

--------------------------------------------------------------------------------
[Q-ALTA] Duplicacao de schema Prisma
--------------------------------------------------------------------------------
Arquivos:
  - backend/prisma/schema.prisma
  - web/prisma/seed.ts (referencia schema)

Problema: O backend possui um schema Prisma, mas a aplicacao web tambem usa
Prisma (em devDependencies). Nao ha indicio de que os dois estao sincronizados.
O backend nao possui codigo executavel (package.json sem script de start,
sem servidor HTTP).

Mitigacao:
  - Consolidar schema em um unico local (monorepo recomendado)
  - Ou remover backend/ se nao e utilizado (a app Next.js ja serve como BE)

--------------------------------------------------------------------------------
[Q-ALTA] Dependencias desatualizadas e conflitantes
--------------------------------------------------------------------------------
Arquivos:
  - backend/package.json: @prisma/client ^7.10.1, prisma ^8.0.0-rc.30
  - web/package.json: @prisma/client ^5.22.0, prisma ^5.22.0

Problema: Versoes incompativeis de Prisma entre web e backend.
A versao 8.0.0-rc.30 e release candidate (instavel).

Mitigacao:
  - Alinhar @prisma/client e prisma para mesma versao estavel (^5.22.0)
  - Remover backend/package.json se nao utilizado

--------------------------------------------------------------------------------
[Q-ALTA] Ausencia de testes
--------------------------------------------------------------------------------
Arquivos:
  - backend/package.json: "test": "echo \"Error: no test specified\" && exit 1"
  - web/package.json: sem script de teste

Problema: Zero cobertura de testes. Nenhum teste unitario, integracao ou E2E.

Mitigacao:
  - Adicionar Vitest ou Jest para testes unitarios
  - Adicionar Playwright para testes E2E criticos (login, agendamento)

--------------------------------------------------------------------------------
[Q-MEDIA] Tratamento de erro inexistente nas APIs
--------------------------------------------------------------------------------
Arquivos: Todos os route.ts

Nenhum endpoint usa try/catch. Erros do Prisma (ex: registro nao encontrado,
violação de unique constraint) retornam 500 com stack trace exposto.

Exemplo em web/src/app/api/staff/route.ts PATCH:
  Se id nao existir, Prisma lanca P2025 (Record to update not found).
  Retorna 500 generico em vez de 404.

Mitigacao:
  - Criar wrapper padronizado para handlers
  - Mapear erros Prisma para HTTP status codes apropriados

--------------------------------------------------------------------------------
[Q-MEDIA] Inconsistencia visual e de tokens de design
--------------------------------------------------------------------------------
Arquivos:
  - web/src/app/page.tsx usa #FF5882, #FAF5EC, #161616
  - web/src/app/admin/hr/page.tsx usa #18181B, #F472B6

Problema: Duas paletas de cores diferentes no mesmo projeto.
#161616 vs #18181B, #FF5882 vs #F472B6.

Mitigacao:
  - Definir design tokens no Tailwind config ou CSS variables
  - Usar tailwind.config.ts para centralizar cores

--------------------------------------------------------------------------------
[Q-MEDIA] Problemas de acessibilidade (a11y)
--------------------------------------------------------------------------------
Arquivos: Varios componentes JSX

- Botões sem atributo 'type="button"' (podem submeter forms indevidamente)
- Links que usam <a href="#"> sem destino real (page.tsx linha 41)
- Emojis usados como unicos identificadores visuais (🐶, 👔)
- Falta de labels em icones/estados
- Cores sem contraste suficiente em alguns badges

Mitigacao:
  - Usar <button> para acoes, <a> para navegacao
  - Adicionar aria-label em icones e botoes
  - Verificar contraste WCAG AA (4.5:1 para texto normal)

--------------------------------------------------------------------------------
[Q-BAIXA] Missing key prop em listas
--------------------------------------------------------------------------------
Arquivo: web/src/app/admin/hr/page.tsx
Linha: 260

  {modalVisits.pets?.flatMap((p: any) => p.appointments || []).map((v: any, i: number) => (
    <tr key={i}>

Problema: Usar indice como key em listas dinamicas pode causar
problemas de reconciliacao do React quando items sao reordenados/removidos.

Mitigacao: Usar v.id como key (se disponivel).

--------------------------------------------------------------------------------
[Q-BAIXA] Uso de target="_blank" sem rel="noopener noreferrer"
--------------------------------------------------------------------------------
Arquivo: web/src/app/admin/hr/page.tsx
Linha: 158

  <a href={`https://wa.me/...`} target="_blank" ...>

Problema: Vulnerabilidade de tabnabbing. A pagina aberta pode manipular
window.opener.

Mitigacao: Adicionar rel="noopener noreferrer".


============================================
4. BUGS FUNCIONAIS
============================================

--------------------------------------------------------------------------------
[BUG-001] Avanco de status do agendamento sem logica de negocio
--------------------------------------------------------------------------------
Arquivo: web/src/app/api/appointments/route.ts

O endpoint PATCH nao existe! O frontend staff/page.tsx chama:
  await fetch(`/api/appointments`, { method: "PATCH", body: JSON.stringify({ id }) })

Mas o route.ts so exporta GET e POST. Isso retorna 405 Method Not Allowed.

Mitigacao: Implementar handler PATCH em /api/appointments/route.ts

--------------------------------------------------------------------------------
[BUG-002] Login redireciona para /admin independentemente do role
--------------------------------------------------------------------------------
Arquivo: web/src/app/login/page.tsx
Linha: 16

  if (res.ok) router.push("/admin")

Problema: Groomers e recepcionistas sao redirecionados para /admin,
que pode conter funcionalidades que nao deveriam acessar.

Mitigacao: Redirecionar baseado no role retornado pela API.

--------------------------------------------------------------------------------
[BUG-003] Rota /api/staff GET retorna user relation que pode ser null
--------------------------------------------------------------------------------
Arquivo: web/src/app/api/staff/route.ts
Linha: 4-9

  include: { user: true }

Problema: StaffMember.userId e opcional (String?). Se userId for null,
a relacao user sera null. O frontend assume que existem propriedades do user.

Mitigacao: Garantir tratamento de null no frontend ou tornar userId obrigatorio.

--------------------------------------------------------------------------------
[BUG-004] Conversao de data em appointments pode falhar
--------------------------------------------------------------------------------
Arquivo: web/src/app/api/appointments/route.ts
Linha: 14-15

  const d = new Date(date)
  where.date = { gte: d, lt: new Date(d.getTime() + 86400000) }

Problema: Se 'date' for invalido (ex: "abc"), new Date("abc") retorna
"Invalid Date", causando query malformada.

Mitigacao: Validar formato da data antes de usar.

--------------------------------------------------------------------------------
[BUG-005] Schema Prisma com campos inconsistentes
--------------------------------------------------------------------------------
Arquivo: backend/prisma/schema.prisma
Linha: 38

  medicalRecords StaffMedicalRecord[]

Problema: O model StaffMedicalRecord nao existe no schema! Esta referenciando
um model inexistente.

Mitigacao: Corrigir para MedicalRecord[] ou criar o model StaffMedicalRecord.

--------------------------------------------------------------------------------
[BUG-006] InventoryMovement referencia User como staff, mas deveria ser StaffMember
--------------------------------------------------------------------------------
Arquivo: backend/prisma/schema.prisma
Linha: 286-287

  staffId   String
  staff     User     @relation(fields: [staffId], references: [id])

Problema: O comentario diz "staff", mas a relacao e com User, nao StaffMember.
Isso permite que qualquer usuario (incluindo clientes se houver) registre
movimentacoes de estoque.

Mitigacao: Mudar relacao para StaffMember.

--------------------------------------------------------------------------------
[BUG-007] MedicalRecord.attachments e String unico em vez de lista
--------------------------------------------------------------------------------
Arquivo: backend/prisma/schema.prisma
Linha: 224

  attachments String // URLs de fotos, raio-x, etc.

Problema: O comentario sugere multiplas URLs, mas o tipo e String unico.
Nao ha como armazenar multiplos anexos de forma estruturada.

Mitigacao: Mudar para String? ou criar model Attachment separado.

--------------------------------------------------------------------------------
[BUG-008] Seed falha se executado multiplas vezes
--------------------------------------------------------------------------------
Arquivo: web/prisma/seed.ts

O seed usa create() sem verificar se registros ja existem. Se executado
novamente, lanca erro de unique constraint em email, sku, cpf, etc.

Mitigacao: Usar upsert() ou deleteMany() antes dos creates.


============================================
5. PROBLEMAS DE ARQUITETURA
============================================

--------------------------------------------------------------------------------
[ARQ-001] Backend orfao
--------------------------------------------------------------------------------
O diretorio backend/ possui schema Prisma, .env e package.json, mas nenhum
codigo executavel. O servidor real e a propria aplicacao Next.js em web/.

Isso causa confusao e duplicacao. Recomendacao: remover backend/ e manter
tudo em web/ (fullstack Next.js), ou extrair APIs para um servidor NestJS/Express
separado.

--------------------------------------------------------------------------------
[ARQ-002] Banco SQLite em producao
--------------------------------------------------------------------------------
Arquivo: web/.env

  DATABASE_URL="file:./dev.db"

SQLite nao e adequado para producao multi-usuario/concorrente.
O README menciona "Para producao PostgreSQL", mas nao ha instrucoes de
migracao nem configuracao de ambiente.

Recomendacao:
  - Usar PostgreSQL com connection pooling (pgbouncer)
  - Usar variavel de ambiente diferente por ambiente

--------------------------------------------------------------------------------
[ARQ-003] Falta de separacao de concerns
--------------------------------------------------------------------------------
As API routes fazem acesso direto ao Prisma sem camada de servico/repositorio.
Isso dificulta testes unitarios e reutilizacao de logica de negocio.

Recomendacao:
  - Criar camada de servicos (services/)
  - Criar camada de repositorios (repositories/)
  - Manter routes enxutas (controller-like)

--------------------------------------------------------------------------------
[ARQ-004] Stateless sem estrategia de cache
--------------------------------------------------------------------------------
Nao ha uso de cache (Redis, React Query, SWR) para dados que mudam
pouco (servicos, staff). Cada pagina faz fetch no useEffect.

Recomendacao:
  - Usar React Query (TanStack Query) para cache e stale-while-revalidate
  - Implementar cache no servidor para dashboard stats

--------------------------------------------------------------------------------
[ARQ-005] App Router usado como Page Router
--------------------------------------------------------------------------------
O projeto usa App Router do Next.js, mas todas as paginas sao "use client"
com fetch em useEffect. Isso anula os beneficios de SSR/SSG do App Router.

Recomendacao:
  - Transformar paginas de leitura em Server Components
  - Usar Server Actions para mutacoes (elimina APIs REST manuais)


============================================
6. CHECKLIST LGPD / CONFORMIDADE
============================================

[ ] Consentimento explicito do tutor para coleta de dados
[ ] Finalidade clara para cada dado coletado (CPF? email?)
[ ] Direito de acesso / retificacao / exclusao de dados
[ ] Registro de operacoes (RIPD)
[ ] Nomeacao de DPO (Encarregado)
[ ] Contrato de processamento com hospedagem
[ ] Criptografia em transito (TLS 1.2+)
[ ] Criptografia em repouso (banco criptografado)
[ ] Politica de retencao de dados
[ ] Incident response plan

Status atual: 0/10 -> NAO CONFORME


============================================
7. RECOMENDACOES PRIORITARIAS
============================================

Prioridade 1 (Imediata - Bloqueia producao):
  1. Implementar autenticacao real (NextAuth.js v5 / Auth.js)
  2. Adicionar middleware de autorizacao em todas as APIs
  3. Validar TODOS os inputs com Zod
  4. Remover .env do Git e rotacionar secrets
  5. Implementar PATCH /api/appointments (bug funcional)

Prioridade 2 (Semana 1-2):
  6. Substituir 'any' por tipos reais do Prisma
  7. Adicionar tratamento de erro global
  8. Configurar headers de seguranca no next.config.ts
  9. Adicionar rate limiting no login
  10. Consolidar/remover diretorio backend/

Prioridade 3 (Mes 1):
  11. Migrar SQLite -> PostgreSQL
  12. Implementar camada de servicos/repositorios
  13. Adicionar testes (unitarios + E2E)
  14. Implementar audit logging
  15. Revisar conformidade LGPD


============================================
8. SCORES
============================================

Seguranca geral:     2/10 (Falhas criticas de auth e autorizacao)
Qualidade de codigo: 4/10 (Any everywhere, sem testes)
Arquitetura:         5/10 (Base ok, mas falta separacao de concerns)
Performance:         6/10 (Prisma e eficiente, mas falta cache)
Acessibilidade:      4/10 (Problemas de contraste e semantica)
LGPD/Compliance:     1/10 (Exposicao total de PII)

Overall:             3.7/10

================================================================================
FIM DO RELATORIO
================================================================================
