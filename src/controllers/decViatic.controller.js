import { DeclarModel } from '../models/decViatic.model.js'
import { generateViaticPDF, generateViaticliquidationPDF, generateViaticMovilityPDF, generateViaticDDJJPDF } from '../services/pdf.service.js'

export const listDecviaticsbyUs = async (req, res) => {
    try {
        const filters = {
            startDate: req.query.startDate || null,
            endDate: req.query.endDate || null,
            status: req.query.status || ['APROB_TESO', 'APROB_DEC_ADM'],
            userId: req.query.userId || null,
        }

        const viatics = await DeclarModel.ListDeclarUs(filters)
        res.json({ ok: true, data: viatics })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const listDecviaticsAdm = async (req, res) => {
    try {
        const filters = {
            startDate: req.query.startDate || null,
            endDate: req.query.endDate || null,
            status: req.query.status || ['APROB_TESO', 'APROB_DEC_ADM'],
            userId: req.query.userId || null,
        }

        console.log(filters, 'filters en el controller');


        const data = await DeclarModel.ListDeclarAdm(filters)

        res.json({ ok: true, data })
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message })
    }
}

export const desactivateDeclar = async (req, res) => {
    try {
        const { id } = req.params
        const { active } = req.body

        const desactivated = await DeclarModel.DesactivateDeclar(id, active)

        res.json({ ok: true, data: desactivated })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const updateViaticStatus = async (req, res) => {
    try {
        const { viaticId } = req.params
        const { status } = req.body

        const updatedViatic = await DeclarModel.updateStatus(viaticId, status)

        res.json({ ok: true, data: updatedViatic })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const getViaticDetail = async (req, res) => {
    try {
        const { viaticId } = req.params;

        const viatic = await DeclarModel.getViaticDetail(viaticId)
        res.json({
            ok: true,
            data: viatic
        })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const getViaticItems = async (req, res) => {
    try {
        const { viaticId } = req.params;

        const items = await DeclarModel.getViaticItems(viaticId)
        res.json({
            ok: true,
            data: items
        })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}


export const addViaticExpense = async (req, res) => {
    try {
        const data = req.body

        const requiresTravel = [
            'MOVILIDAD',
            'DECLARACION_JURADA'
        ]

        if (requiresTravel.includes(data.document_type)) {
            if (!data.travelFrom || !data.travelTo) {
                return res.status(400).json({
                    ok: false,
                    error: 'Debe ingresar origen y destino'
                })
            }
        }

        const newExpense = await DeclarModel.addViaticExpense(data)

        res.json({
            ok: true,
            data: newExpense
        })

    } catch (err) {
        res.status(500).json({
            ok: false,
            error: err.message
        })
    }
}

export const editViaticExpense = async (req, res) => {
    try {
        const data = req.body

        const requiresTravel = [
            'MOVILIDAD',
            'DECLARACION_JURADA'
        ]

        if (requiresTravel.includes(data.document_type)) {
            if (!data.travelFrom || !data.travelTo) {
                return res.status(400).json({
                    ok: false,
                    error: 'Debe ingresar origen y destino'
                })
            }
        }

        const updatedExpense = await DeclarModel.editViaticExpense(data)

        res.json({
            ok: true,
            data: updatedExpense
        })

    } catch (err) {
        res.status(500).json({
            ok: false,
            error: err.message
        })
    }
}

export const editViaticDates = async (req, res) => {
    const data = req.body
    try {
        const editViaticdate = await DeclarModel.editViaticDates(data)
        res.json({ ok: true, data: editViaticdate })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}




export const deleteViaticExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;

        const deletedExpense = await DeclarModel.deleteViaticExpense(expenseId)

        res.json({
            ok: true,
            data: deletedExpense
        })

    } catch (err) {
        res.status(500).json({
            ok: false,
            error: err.message
        })
    }
}

export const desactivateViaticExpense = async (req, res) => {
    try {
        const { viaticId } = req.params;

        const desactivatedViatic = await DeclarModel.desactivateViatic(viaticId)

        res.json({
            ok: true,
            data: desactivatedViatic
        })

    } catch (err) {
        res.status(500).json({
            ok: false,
            error: err.message
        })
    }
}
// configuraciones de opciones de liquidaciones

export const getLiquidationConfigurations = async (req, res) => {
    try {
        const configurations = await DeclarModel.getLiquidationConfigurations()
        res.json({
            ok: true,
            data: configurations
        })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const addLiquidationConfiguration = async (req, res) => {
    try {
        const data = req.body;

        const newConfig = await DeclarModel.addLiquidationConfiguration(data)
        res.json({
            ok: true,
            data: newConfig
        })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const editLiquidationConfiguration = async (req, res) => {
    try {
        const data = req.body;

        const updatedConfig = await DeclarModel.editLiquidationConfiguration(data)
        res.json({
            ok: true,
            data: updatedConfig
        })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const getLiquidationConfigurationsWtype = async (req, res) => {
    try {
        const { type } = req.params;

        const configurations = await DeclarModel.getLiquidationConfigurationsWtype(type)
        res.json({
            ok: true,
            data: configurations
        })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const getViaticPDF = async (req, res) => {
    try {

        const { viaticId } = req.params

        // 🔹 1. Consulta principal
        const viatic = await DeclarModel.getViaticInfoPDFData(viaticId)

        const data = {
            ...viatic,
        }

        const pdfBuffer = await generateViaticPDF(data)

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename=viatico-${viaticId}.pdf`,
            'Content-Length': pdfBuffer.length
        })

        res.send(pdfBuffer)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getViaticLiquidationPDF = async (req, res) => {
    try {

        const { viaticId } = req.params

        // 🔹 1. Consulta principal
        const viatic = await DeclarModel.getViaticLiquidationData(viaticId)

        const data = {
            ...viatic,
        }

        const pdfBuffer = await generateViaticliquidationPDF(data)

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename=liquidacion-${viaticId}.pdf`,
            'Content-Length': pdfBuffer.length
        })

        res.send(pdfBuffer)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getViaticMovilityPDF = async (req, res) => {
    try {

        const { viaticId } = req.params

        // 🔹 1. Consulta principal
        const viatic = await DeclarModel.getViaticMovilityData(viaticId)

        const data = {
            ...viatic,
        }

        const pdfBuffer = await generateViaticMovilityPDF(data)

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename=movilidad-${viaticId}.pdf`,
            'Content-Length': pdfBuffer.length
        })

        res.send(pdfBuffer)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getViaticDDJJPDF = async (req, res) => {
    try {

        const { viaticId } = req.params

        // 🔹 1. Consulta principal
        const viatic = await DeclarModel.getViaticDDJJData(viaticId)

        const data = {
            ...viatic,
        }

        const pdfBuffer = await generateViaticDDJJPDF(data)

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename=ddjj-${viaticId}.pdf`,
            'Content-Length': pdfBuffer.length
        })

        res.send(pdfBuffer)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}