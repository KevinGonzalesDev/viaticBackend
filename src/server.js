import app from './app.js'
import { env } from './config/env.js'

app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`)
})

// import express from 'express'

// const app = express()

// app.get('/test', (req, res) => {
//     res.json({ ok: true })
// })

// const PORT = process.env.PORT || 3000

// app.listen(PORT, () => {
//     console.log('Servidor iniciado en puerto', PORT)
// })