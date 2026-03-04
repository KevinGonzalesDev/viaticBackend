import pkg from 'pg'
const { Pool } = pkg
import dotenv from 'dotenv'

dotenv.config()

export const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || '00002509',
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
    database: process.env.PG_DATABASE || 'difatech',
    max: 10,
})

export default pool