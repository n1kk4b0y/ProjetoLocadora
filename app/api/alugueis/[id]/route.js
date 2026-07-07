import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const resultado = await pool.query('SELECT * FROM Aluguel WHERE id = $1', [id]);
    if (!resultado.rows.length) {
      return NextResponse.json({ error: 'Aluguel não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(resultado.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const { cliente_id, carro_id, data_locacao, data_entrega_prevista, valor, status } = body;

  try {
    const resultado = await pool.query(
      `UPDATE Aluguel
       SET cliente_id = $1, carro_id = $2, data_locacao = $3,
           data_entrega_prevista = $4, valor = $5, status = $6
       WHERE id = $7
       RETURNING *`,
      [cliente_id, carro_id, data_locacao, data_entrega_prevista, valor, status || 'ativo', id]
    );
    if (!resultado.rows.length) {
      return NextResponse.json({ error: 'Aluguel não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(resultado.rows[0]);
  } catch (err) {
    if (err.code === '23503') {
      return NextResponse.json({ error: 'Cliente ou carro informado não existe.' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const resultado = await pool.query('DELETE FROM Aluguel WHERE id = $1 RETURNING id', [id]);
    if (!resultado.rows.length) {
      return NextResponse.json({ error: 'Aluguel não encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
