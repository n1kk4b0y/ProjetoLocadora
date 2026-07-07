import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/clientes            -> lista todos
// GET /api/clientes?nome=ana   -> pesquisa por nome (WHERE ... ILIKE)
// GET /api/clientes?cidade=... -> pesquisa por cidade
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nome = searchParams.get('nome');
  const cidade = searchParams.get('cidade');

  try {
    let query = 'SELECT * FROM Cliente';
    const condicoes = [];
    const valores = [];

    if (nome) {
      valores.push(`%${nome}%`);
      condicoes.push(`nome ILIKE $${valores.length}`);
    }
    if (cidade) {
      valores.push(`%${cidade}%`);
      condicoes.push(`cidade ILIKE $${valores.length}`);
    }
    if (condicoes.length) {
      query += ' WHERE ' + condicoes.join(' AND ');
    }
    query += ' ORDER BY id';

    const resultado = await pool.query(query, valores);
    return NextResponse.json(resultado.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/clientes -> cria um novo cliente
export async function POST(request) {
  const body = await request.json();
  const { nome, cpf, telefone, cidade, data_cadastro } = body;

  if (!nome || !cpf) {
    return NextResponse.json({ error: 'Nome e CPF são obrigatórios.' }, { status: 400 });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO Cliente (nome, cpf, telefone, cidade, data_cadastro)
       VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE))
       RETURNING *`,
      [nome, cpf, telefone || null, cidade || null, data_cadastro || null]
    );
    return NextResponse.json(resultado.rows[0], { status: 201 });
  } catch (err) {
    if (err.code === '23505') {
      return NextResponse.json({ error: 'Já existe um cliente com esse CPF.' }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
