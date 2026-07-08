# Sistema de Aluguel de Carros

Trabalho Prático de Banco de Dados I — Bacharelado em Engenharia de Computação, IFRJ Campus Niterói.

Aplicação web (Next.js + PostgreSQL) para gerenciar o aluguel de carros, com CRUD completo para
**Cliente** e **Aluguel**, e consultas de relatório envolvendo a tabela **Carros**.

## Tecnologias

- **Front-end / Back-end:** Next.js 14 (App Router), React, rotas de API (`app/api/**`) usando SQL puro.
- **Banco de dados:** PostgreSQL (biblioteca `pg`), modelo relacional.
- **Estilo:** CSS simples (`app/globals.css`), sem dependências extras.

## Modelo relacional

```
Carros (1) ────< Aluguel >──── (1) Cliente
```

- `Carros(id, placa, modelo, marca, ano, valor_diaria)`
- `Cliente(id, nome, cpf, telefone, cidade, data_cadastro)`
- `Aluguel(id, cliente_id -> Cliente, carro_id -> Carros, data_locacao, data_entrega_prevista, valor, status)`

Regra de integridade: `cliente_id` e `carro_id` usam `ON DELETE RESTRICT` (não é possível excluir um
cliente ou carro que já tenha aluguéis, preservando o histórico) e `ON UPDATE CASCADE`.

## Como rodar localmente

### 1. Banco de dados

Instale o PostgreSQL localmente (ou use Neon/Supabase na nuvem) e crie um banco `aluguel_carros`.
Depois, execute os scripts na pasta `sql/` **em ordem**:

```bash
psql -U seu_usuario -d aluguel_carros -f sql/01_criar_banco.sql
psql -U seu_usuario -d aluguel_carros -f sql/02_inserir_dados.sql
```

Os demais scripts (`03` a `06`) podem ser executados manualmente para demonstrar apagar dados,
consulta agregada com filtro, subconsulta com `ALL` e subconsulta com `EXISTS`.

### 2. Aplicação

```bash
npm install
cp .env.example .env.local   # edite com a sua string de conexão (DATABASE_URL)
npm run dev
```

Acesse `http://localhost:3000`.

## Estrutura de pastas

```
app/
  page.js                 -> página inicial
  clientes/page.js        -> CRUD + pesquisa de clientes
  alugueis/page.js        -> CRUD + pesquisa de aluguéis
  relatorios/page.js      -> consultas com JOIN, agregação e NOT IN
  api/
    clientes/route.js         -> GET (lista/pesquisa), POST
    clientes/[id]/route.js    -> GET, PUT, DELETE
    alugueis/route.js         -> GET (lista/pesquisa), POST
    alugueis/[id]/route.js    -> GET, PUT, DELETE
    carros/route.js           -> GET (usado nos formulários)
    relatorios/
      aluguel-por-cliente/route.js      -> INNER JOIN
      somatorio-por-cliente/route.js    -> INNER JOIN + agregação
      carros-nao-alugados/route.js      -> subconsulta com NOT IN
lib/db.js                -> conexão com o PostgreSQL (pool)
sql/                      -> os 6 scripts SQL exigidos no trabalho
```

## Publicando no GitHub

Este projeto já está pronto para virar um repositório Git. Para publicar na sua conta:

```bash
cd aluguel-carros
git init
git add .
git commit -m "Versão inicial do Sistema de Aluguel de Carros"

# Crie um repositório vazio no GitHub (pelo site, sem README/gitignore) e depois:
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/aluguel-carros.git
git push -u origin main
```
