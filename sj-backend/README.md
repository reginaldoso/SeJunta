# sj-backend

Scaffold inicial do backend do projeto SeJunta.

Como usar (desenvolvimento):

# sj-backend

Scaffold inicial do backend do projeto SeJunta.

Como usar (desenvolvimento):

```bash
# iniciar banco PostGIS (ex.: docker-compose up -d db)
cd sj-backend
npm install
npm run dev
```

Executar testes sem `npm` (apenas `node` necessário):

```bash
node tests/run_no_npm_tests.js
```

Endpoints iniciais:
- `GET /health` — verifica o serviço
- `POST /users/register` — registro (mock)
- `POST /users/login` — login (mock)

Database initialization (Windows PowerShell):

1. Start the PostGIS container and apply the initial schema:

```powershell
cd ..\
.\scripts\init-db.ps1
```

This script runs `docker-compose up -d db`, copies `sj-backend/db/init.sql` into the PostGIS container and executes it. The script uses the default credentials from `docker-compose.yml` (user: `sj`, password: `sjpass`, db: `sjdb`).

Manual quick test (after backend is running):

```bash
# register a new user
curl -X POST http://localhost:3000/users/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@ufba.br","password":"1234","cpf":"12345678901"}'

# (If SMTP not configured, check backend logs for verification link, then open it in browser.)

# login
curl -X POST http://localhost:3000/users/login -H "Content-Type: application/json" -d '{"email":"test@ufba.br","password":"1234"}'
```
