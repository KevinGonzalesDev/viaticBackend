import { Router } from 'express'
import {
    listDecviaticsbyUs,
    getViaticDetail,
    getViaticItems,
    getLiquidationConfigurations,
    addLiquidationConfiguration,
    editLiquidationConfiguration,
    getLiquidationConfigurationsWtype,
    addViaticExpense,
    editViaticExpense,
    deleteViaticExpense,
    desactivateViaticExpense,
    editViaticDates,
    getViaticPDF,
    getViaticLiquidationPDF,
    getViaticMovilityPDF,
    getViaticDDJJPDF,
    listDecviaticsAdm,
    desactivateDeclar,
    updateViaticStatus

} from '../controllers/decViatic.controller.js'

const router = Router()


router.get('/user/viatics', listDecviaticsbyUs)
router.get('/admin/viatics', listDecviaticsAdm)
router.put('/admin/desactivate/:id', desactivateDeclar)
router.get('/detail/:viaticId', getViaticDetail)
router.get('/items/:viaticId', getViaticItems)
router.get('/configurations/liquidation', getLiquidationConfigurations)
router.post('/configurations/liquidation', addLiquidationConfiguration)
router.put('/configurations/liquidation', editLiquidationConfiguration)
router.get('/configurations/liquidation/type/:type', getLiquidationConfigurationsWtype)
router.post('/expenses', addViaticExpense)
router.put('/expenses', editViaticExpense)
router.delete('/expenses/:expenseId', deleteViaticExpense)
router.put('/status/:viaticId', updateViaticStatus)
router.put('/desactivate/:viaticId', desactivateViaticExpense)
router.put('/editdates', editViaticDates)
router.get('/pdf/:viaticId', getViaticPDF)
router.get('/pdf/liquidation/:viaticId', getViaticLiquidationPDF)
router.get('/pdf/movility/:viaticId', getViaticMovilityPDF)
router.get('/pdf/ddjj/:viaticId', getViaticDDJJPDF)





export default router
