import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/auth.model.js'

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ ok: false, error: 'Datos incompletos' })
        }

        const user = await UserModel.findUserByEmail(email)

        if (!user) {
            return res.status(401).json({ ok: false, error: 'Credenciales inválidas' })
        }

        if (!user.active) {
            return res.status(403).json({ ok: false, error: 'Usuario inactivo' })
        }

        const match = await bcrypt.compare(password, user.password_hash)

        if (!match) {
            return res.status(401).json({ ok: false, error: 'Credenciales inválidas' })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        )

        res.json({
            ok: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.first_name} ${user.last_name}`,
                avatar: user.avatar_img,
                roles: user.roles,
            },
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ ok: false, error: 'Error en login' })
    }
}

