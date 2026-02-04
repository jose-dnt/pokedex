import 'server-only';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: 'db',
  user: 'user',
  password: '123',
  database: 'postgres',
  port: 5433
});

export default pool;