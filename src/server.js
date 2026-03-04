// src/server.js
import app from './app.js'
import { env } from './config/env.js'

const PORT = env.PG_PORT

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})
