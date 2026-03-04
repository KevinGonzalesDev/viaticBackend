import pkg from 'pg'
const { Pool } = pkg
import { env } from '../config/env.js'

export const pool = new Pool({
    user: env.PG_USER,
    password: env.PG_PASSWORD,
    host: env.PG_HOST,
    port: env.PG_PORT,
    database: env.PG_DATABASE,
    max: 10,
})

export default pool