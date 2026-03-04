import { listEmployeesWithRoles, getAllRoles, updateUserRoles } from '../models/roles.model.js'

export const getEmployeesWithRoles = async (req, res) => {
    try {
        const employees = await listEmployeesWithRoles()
        res.json({ ok: true, data: employees })
    } catch (error) {
        console.error(error)
        res.status(500).json({ ok: false, error: error.message })
    }
}

export const listRoles = async (req, res) => {
    try {
        const roles = await getAllRoles()
        res.json({ ok: true, data: roles })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const putEmployeeRoles = async (req, res) => {
    const { employeeId } = req.params
    const { roles } = req.body

    if (!Array.isArray(roles)) {
        return res.status(400).json({
            message: 'roles debe ser un array'
        })
    }

    try {
        await updateUserRoles(employeeId, roles)

        res.json({
            message: 'Roles actualizados correctamente',
            roles
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error al actualizar roles'
        })
    }
}