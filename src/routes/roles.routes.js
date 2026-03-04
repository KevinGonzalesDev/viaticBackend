import { Router } from 'express'
import { getEmployeesWithRoles, listRoles, putEmployeeRoles } from '../controllers/roles.controller.js'

const router = Router()

router.get('/', getEmployeesWithRoles)
router.get('/list-roles', listRoles)
router.put(
    '/employees/:employeeId/roles',
    putEmployeeRoles
)


export default router