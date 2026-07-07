import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/relatorios/aluguel-por-cliente?nome=ana
// Retorna nome do cliente, data da locação, valor, entrega prevista e placa do carro
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nome = searchParams.get('nome');

  try {
    let query = `
      SELECT
        cl.nome AS cliente,
        a.data_locacao,
        a.data_entrega_prevista,
        a.valor,
        ca.placa
      FROM Cliente cl
      INNER JOIN Aluguel a ON a.cliente_id = cl.id
      INNER JOIN Carros ca ON ca.id = a.carro_id
    `;
    const valores = [];
    if (nome) {
      valores.push(`%${nome}%`);
      query += ` WHERE cl.nome ILIKE $${valores.length}`;
    }
    query += ' ORDER BY a.data_locacao DESC';

    const resultado = await pool.query(query, valores);
    return NextResponse.json(resultado.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
