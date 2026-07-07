import { Pool } from 'pg';

// Reaproveita a mesma conexão entre requisições em desenvolvimento
// (evita esgotar o pool de conexões com o hot-reload do Next.js)
const globalForPg = globalThis;

const pool =
  globalForPg._pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : false,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg._pgPool = pool;
}

export default pool;
