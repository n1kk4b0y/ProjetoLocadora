import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const resultado = await pool.query('SELECT * FROM Cliente WHERE id = $1', [id]);
    if (!resultado.rows.length) {
      return NextResponse.json({ error: 'Cliente não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(resultado.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const { nome, cpf, telefone, cidade, data_cadastro } = body;

  try {
    const resultado = await pool.query(
      `UPDATE Cliente
       SET nome = $1, cpf = $2, telefone = $3, cidade = $4, data_cadastro = $5
       WHERE id = $6
       RETURNING *`,
      [nome, cpf, telefone || null, cidade || null, data_cadastro || null, id]
    );
    if (!resultado.rows.length) {
      return NextResponse.json({ error: 'Cliente não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(resultado.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return NextResponse.json({ error: 'Já existe um cliente com esse CPF.' }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const resultado = await pool.query('DELETE FROM Cliente WHERE id = $1 RETURNING id', [id]);
    if (!resultado.rows.length) {
      return NextResponse.json({ error: 'Cliente não encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Violação de chave estrangeira (RESTRICT): cliente possui aluguéis
    if (err.code === '23503') {
      return NextResponse.json(
        { error: 'Não é possível excluir: este cliente possui aluguéis registrados.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
