// src/controllers/employee.controller.js
import bcrypt from 'bcrypt'
import { createEmployee, listEmployees, findEmployeeById, updateEmployeeM, deleteEmployeeM } from '../models/employee.model.js'

export const saveEmployee = async (req, res) => {
    try {
        // Si subiste con multer, el path/url quedó en req.file
        const avatarUrl = req.file ? `/uploads/avatars/${req.file.filename}` : req.body.avatarImg || null
        console.log(req.body.password);

        const passwordHash = await bcrypt.hash(req.body.password, 10)

        const payload = {
            avatarImg: avatarUrl,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            dni: req.body.dni,
            position: req.body.position,
            firm_position: req.body.firm_position,
            area: req.body.area,
            phone: req.body.phone,
            email: req.body.email,
            passwordHash,
            active: req.body.active === 'true' || req.body.active === true
        }

        const employee = await createEmployee(payload)
        res.json({ ok: true, data: employee })
    } catch (error) {
        console.error(error)
        res.status(500).json({ ok: false, error: error.message })
    }
}

export const getEmployees = async (req, res) => {
    try {
        const rows = await listEmployees()
        res.json({ ok: true, data: rows })
    } catch (error) {
        console.error(error)
        res.status(500).json({ ok: false, error: error.message })
    }
}

export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params

        const employee = await findEmployeeById(id)

        if (!employee) {
            return res.status(404).json({ ok: false, message: 'Empleado no encontrado' })
        }

        res.json({ ok: true, data: employee })
    } catch (error) {
        console.error(error)
        res.status(500).json({ ok: false, error: error.message })
    }
}

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params

        const payload = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            dni: req.body.dni,
            position: req.body.position,
            firm_position: req.body.firm_position,
            area: req.body.area,
            phone: req.body.phone,
            email: req.body.email,
            active: req.body.active === 'true' || req.body.active === true,
        }

        if (req.file) {
            payload.avatar_img = `/uploads/avatars/${req.file.filename}`
        }

        if (req.body.password && req.body.password.trim() !== '') {
            payload.password_hash = await bcrypt.hash(req.body.password, 10)
        }

        const employee = await updateEmployeeM(id, payload)
        res.json({ ok: true, data: employee })
    } catch (error) {
        console.error(error)
        res.status(500).json({ ok: false, error: error.message })
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params
        await deleteEmployeeM(id)
        res.json({ ok: true })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}


