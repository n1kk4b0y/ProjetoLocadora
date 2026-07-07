import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/carros -> lista todos os carros (usado no formulário de aluguel)
export async function GET() {
  try {
    const resultado = await pool.query('SELECT * FROM Carros ORDER BY modelo');
    return NextResponse.json(resultado.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
