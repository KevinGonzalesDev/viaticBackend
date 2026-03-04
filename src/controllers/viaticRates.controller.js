import { ViaticRatesModel } from '../models/viaticRates.model.js'

export const listViaticConcepts = async (req, res) => {
    try {
        const concepts = await ViaticRatesModel.listviaticConcepts()
        res.json({ ok: true, data: concepts })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const addViaticConcept = async (req, res) => {
    try {
        const { description } = req.body
        const concept = await ViaticRatesModel.addViaticConcept(description)
        res.json({ ok: true, data: concept })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const editViaticConcept = async (req, res) => {
    try {
        const { conceptId, description } = req.body
        const concept = await ViaticRatesModel.editViaticConcept(conceptId, description)
        res.json({ ok: true, data: concept })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteViaticConcept = async (req, res) => {
    try {
        const { id } = req.params
        await ViaticRatesModel.deleteViaticConcept(id)
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

// export const listViaticrates = async (req, res) => {
//     try {
//         const rates = await ViaticRatesModel.listViaticrates()
//         res.json({ ok: true, data: rates })
//     } catch (err) {
//         res.status(500).json({ ok: false, error: err.message })
//     } 
// }

export const listViaticrates = async (req, res) => {
    try {
        const rows = await ViaticRatesModel.listViaticrates()

        const grouped = {}

        rows.forEach(r => {
            if (!grouped[r.district_id]) {
                grouped[r.district_id] = {
                    district_id: r.district_id,
                    district_name: r.district_name,
                    costs: [],
                }
            }

            grouped[r.district_id].costs.push({
                id: r.id,
                concept_id: r.concept_id,
                concept_name: r.concept_name,
                amount: Number(r.amount),
                frequency_type: r.frequency_type,
                frequency: r.frequency,
                active: r.active,
            })
        })

        res.json({
            ok: true,
            data: Object.values(grouped),
        })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const createViaticRate = async (req, res) => {
    try {
        const data = req.body
        const rate = await ViaticRatesModel.createViaticRate(data)
        res.json({ ok: true, data: rate })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const updateViaticRate = async (req, res) => {
    try {
        const data = req.body
        const rate = await ViaticRatesModel.updateViaticRate(data)
        res.json({ ok: true, data: rate })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const desactivateViaticRate = async (req, res) => {
    try {
        const { id } = req.params
        const { active } = req.body
        const rate = await ViaticRatesModel.desactivateViaticRate(id, active)
        res.json({ ok: true, data: rate })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteViaticRate = async (req, res) => {
    try {
        await ViaticRatesModel.deleteViaticRate(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

