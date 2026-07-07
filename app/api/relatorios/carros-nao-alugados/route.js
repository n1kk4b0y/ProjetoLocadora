import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/relatorios/carros-nao-alugados?inicio=2026-06-01&fim=2026-06-30
// Retorna os carros que NÃO tiveram nenhum aluguel no período informado
// (subconsulta com NOT IN, conforme exigido na especificação)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const inicio = searchParams.get('inicio');
  const fim = searchParams.get('fim');

  if (!inicio || !fim) {
    return NextResponse.json({ error: 'Informe o período (inicio e fim).' }, { status: 400 });
  }

  try {
    const query = `
      SELECT id, placa, modelo, marca, valor_diaria
      FROM Carros
      WHERE id NOT IN (
        SELECT carro_id
        FROM Aluguel
        WHERE data_locacao BETWEEN $1 AND $2
      )
      ORDER BY modelo;
    `;
    const resultado = await pool.query(query, [inicio, fim]);
    return NextResponse.json(resultado.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
