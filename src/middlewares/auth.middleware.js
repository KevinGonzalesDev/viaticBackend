import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ ok: false, error: 'Token requerido' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET)
        req.user = decoded
        next()
    } catch {
        res.status(401).json({ ok: false, error: 'Token inválido' })
    }
}