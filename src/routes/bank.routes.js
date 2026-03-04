import { Router } from 'express'
import {
    addBankAccount,
    editBankAccount,
    getBankAccountsByOwner,
    deleteBankAccount,
    desactivateBankAccount
} from '../controllers/bank.controller.js'

const router = Router()


router.post('/', addBankAccount)
router.put('/', editBankAccount)
router.get('/:ownerType/:ownerId', getBankAccountsByOwner)
router.delete('/:bankId', deleteBankAccount)
router.put('/desactivate/:id', desactivateBankAccount)




export default router