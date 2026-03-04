// src/routes/employee.routes.js
import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { saveEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee } from '../controllers/employee.controller.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuración Multer: guardar en /uploads/avatars
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/avatars'))
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        const base = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, `${base}${ext}`)
    }
})

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }) // max 2MB

const router = express.Router()

// POST /api/employee/account -> multipart/form-data (avatar file opcional)
router.post('/account', upload.single('avatar'), saveEmployee)

// GET /api/employee -> listar
router.get('/', getEmployees)
router.get('/:id', getEmployeeById)
router.put('/:id', upload.single('avatar'), updateEmployee)
router.delete('/:id', deleteEmployee)

export default router
