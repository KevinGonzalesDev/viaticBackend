import { Router } from 'express'
import { addDepositViatic, editDepositViatic, getDepositsByViaticId, getDepositcountByViaticId, deleteDepositViatic, changeViaticCode } from '../controllers/deposit.controller.js'

const router = Router()


router.post('/', addDepositViatic)
router.put('/', editDepositViatic)
router.get('/find/:viaticId', getDepositsByViaticId)
router.get('/count/', getDepositcountByViaticId)
router.delete('/:depositId', deleteDepositViatic)
router.put('/change-code/:viaticId', changeViaticCode)


export default router
