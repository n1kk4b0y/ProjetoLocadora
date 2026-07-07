import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/relatorios/somatorio-por-cliente?cidade=niteroi
// Retorna nome do cliente e o somatório dos valores dos seus aluguéis
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cidade = searchParams.get('cidade');

  try {
    let query = `
      SELECT
        cl.nome AS cliente,
        cl.cidade,
        COUNT(a.id) AS quantidade,
        SUM(a.valor) AS total_alugueis
      FROM Cliente cl
      INNER JOIN Aluguel a ON a.cliente_id = cl.id
    `;
    const valores = [];
    if (cidade) {
      valores.push(`%${cidade}%`);
      query += ` WHERE cl.cidade ILIKE $${valores.length}`;
    }
    query += ' GROUP BY cl.nome, cl.cidade ORDER BY total_alugueis DESC';

    const resultado = await pool.query(query, valores);
    return NextResponse.json(resultado.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
