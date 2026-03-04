import { Router } from 'express'
import {
    addViatic,
    ListViaticbyID,
    ListAllViatic,
    aprobeViatic,
    editsoliViatic,
    deleteViatic,
    rejectViatic,
    getViaticcountByUserId

} from '../controllers/viatic.controller.js'

const router = Router()

router.get('/listallviatics', ListAllViatic)
router.get('/listviaticbyid/:userId', ListViaticbyID)
router.get('/count', getViaticcountByUserId)
router.post('/addviatics', addViatic)
router.put('/editsoliviatic', editsoliViatic)
router.delete('/deleteviatic/:viaticId', deleteViatic)
router.put('/aprobeviatic', aprobeViatic)
router.put('/rejectviatic', rejectViatic)


export default router
