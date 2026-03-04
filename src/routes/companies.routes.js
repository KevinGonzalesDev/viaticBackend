import { Router } from 'express'
import {
    listAllCompanies,
    getCompanyById,
    addCompany,
    editCompany,
    listCompaniesSelect
} from '../controllers/companies.controller.js'

const router = Router()


router.get('/', listAllCompanies)
router.get('/select/', listCompaniesSelect)
router.get('/:companyId', getCompanyById)
router.post('/', addCompany)
router.put('/', editCompany)





export default router