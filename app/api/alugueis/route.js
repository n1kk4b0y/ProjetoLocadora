import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/alugueis                       -> lista todos (com JOIN para exibir nome/placa)
// GET /api/alugueis?inicio=...&fim=...     -> pesquisa por período de locação
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const inicio = searchParams.get('inicio');
  const fim = searchParams.get('fim');

  try {
    let query = `
      SELECT a.*, cl.nome AS nome_cliente, ca.placa
      FROM Aluguel a
      INNER JOIN Cliente cl ON cl.id = a.cliente_id
      INNER JOIN Carros ca ON ca.id = a.carro_id
    `;
    const valores = [];

    if (inicio && fim) {
      valores.push(inicio, fim);
      query += ` WHERE a.data_locacao BETWEEN $1 AND $2`;
    }
    query += ' ORDER BY a.data_locacao DESC';

    const resultado = await pool.query(query, valores);
    return NextResponse.json(resultado.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/alugueis -> cria um novo aluguel
export async function POST(request) {
  const body = await request.json();
  const { cliente_id, carro_id, data_locacao, data_entrega_prevista, valor, status } = body;

  if (!cliente_id || !carro_id || !data_locacao || !data_entrega_prevista || !valor) {
    return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO Aluguel (cliente_id, carro_id, data_locacao, data_entrega_prevista, valor, status)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'ativo'))
       RETURNING *`,
      [cliente_id, carro_id, data_locacao, data_entrega_prevista, valor, status || null]
    );
    return NextResponse.json(resultado.rows[0], { status: 201 });
  } catch (err) {
    if (err.code === '23503') {
      return NextResponse.json({ error: 'Cliente ou carro informado não existe.' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
