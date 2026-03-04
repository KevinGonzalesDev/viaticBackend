import { Router } from 'express'
import {
    createViaticRate,
    updateViaticRate,
    desactivateViaticRate,
    deleteViaticRate,
    listViaticConcepts,
    addViaticConcept,
    editViaticConcept,
    deleteViaticConcept,
    listViaticrates,
} from '../controllers/viaticRates.controller.js'

const router = Router()

router.get('/', listViaticrates)
router.post('/rates', createViaticRate)
router.put('/rates', updateViaticRate)
router.put('/desactivate/:id', desactivateViaticRate)
router.delete('/:id', deleteViaticRate)

router.get('/concepts', listViaticConcepts)
router.post('/concepts', addViaticConcept)
router.put('/concepts', editViaticConcept)
router.delete('/concepts/:id', deleteViaticConcept)

export default router
