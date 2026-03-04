import { Router } from 'express'
import {
    createProvince,
    createDistrict,
    deleteProvince,
    deleteDistrict,
    listDepartments,
    listProvinces,
    listProvincesWId,
    listDistrictsWId,
    listAllDistricts,
    desactivateDepartment,
    desactivateProvince,
    desactivateDistrict,
    editProvince,
    editDistrict
} from '../controllers/locations.controller.js'

const router = Router()


router.get('/departments', listDepartments)
router.get('/provinces', listProvinces)
router.get('/districts/', listAllDistricts)


router.get('/provinces/department/:departmentId', listProvincesWId)
router.get('/provinces/districts/:provinceId', listDistrictsWId)
router.put('/departments/desactivate/:id', desactivateDepartment)
router.put('/provinces/desactivate/:id', desactivateProvince)
router.put('/districts/desactivate/:id', desactivateDistrict)
router.post('/provinces', createProvince)
router.put('/provinces/', editProvince)
router.post('/districts', createDistrict)
router.put('/districts/', editDistrict)
router.delete('/provinces/:id', deleteProvince)
router.delete('/districts/:id', deleteDistrict)

export default router
