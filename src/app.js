// src/app.js
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import employeeRoutes from './routes/employee.routes.js'
import authRoutes from './routes/auth.routes.js'
import rolesRoutes from './routes/roles.routes.js'
import viaticRates from './routes/viaticRates.routes.js'
import locationRoutes from './routes/location.routes.js'
import proyectsRoutes from './routes/proyects.routes.js'
import viaticRoutes from './routes/viatic.routes.js'
import budgetRoutes from './routes/budget.routes.js'
import depositRoutes from './routes/deposit.routes.js'
import decViaticRoutes from './routes/decViatic.routes.js'
import companiesRoutes from './routes/companies.routes.js'
import bankRoutes from './routes/bank.routes.js'
import dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// CORS (ajusta orígenes en producción)
app.use(cors())

// Para recibir JSON pequeños (aun cuando usamos multipart para avatar)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Rutas
app.use('/api/employee', employeeRoutes)

app.use('/api/auth', authRoutes)

app.use('/api/roles', rolesRoutes)

app.use('/api/rates', viaticRates)

app.use('/api/locations', locationRoutes)

app.use('/api/proyects', proyectsRoutes)

app.use('/api/viatics', viaticRoutes)

app.use('/api/budget', budgetRoutes)

app.use('/api/deposits', depositRoutes)

app.use('/api/decviatics', decViaticRoutes)

app.use('/api/companies', companiesRoutes)

app.use('/api/bank', bankRoutes)

app.get('/saludo', (req, res) => res.json({ mensaje: 'Hola desde el backend 😎' }))

export default app
