import dotenv from 'dotenv'

dotenv.config()

export const env = {
    PORT: process.env.PORT || 3000,
    PG_USER: process.env.PG_USER,
    PG_PASSWORD: process.env.PG_PASSWORD,
    PG_HOST: process.env.PG_HOST,
    PG_PORT: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
    PG_DATABASE: process.env.PG_DATABASE,
    JWT_SECRET: process.env.JWT_SECRET,
}