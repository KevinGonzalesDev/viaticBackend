import { ViaticModel } from '../models/viatic.model.js'

export const addViatic = async (req, res) => {
    try {
        const data = req.body
        const newViatic = await ViaticModel.addViatic(data)
        res.json({ ok: true, data: newViatic })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const ListAllViatic = async (req, res) => {
    try {
        const viatics = await ViaticModel.ListAllViatic()
        res.json({ ok: true, data: viatics })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const ListViaticbyID = async (req, res) => {
    try {
        const { userId } = req.params
        const viatics = await ViaticModel.ListViaticbyID(userId)
        res.json({ ok: true, data: viatics })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const getViaticcountByUserId = async (req, res) => {
    try {
        const { userId } = req.query
        const { date } = req.query
        const { excludeId } = req.query
        console.log('controller', userId, date);
        const viaticCount = await ViaticModel.getViaticcountByUserId(userId, date, excludeId)
        res.json({ ok: true, data: viaticCount })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const aprobeViatic = async (req, res) => {
    try {
        const data = req.body
        const aprovedViatic = await ViaticModel.aprobeViatic(data)
        res.json({ ok: true, data: aprovedViatic })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const rejectViatic = async (req, res) => {
    try {
        const data = req.body
        const rejectedViatic = await ViaticModel.refusedViatic(data)
        res.json({ ok: true, data: rejectedViatic })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const editsoliViatic = async (req, res) => {
    try {
        const data = req.body
        const editsoliViatic = await ViaticModel.editsoliViatic(data)
        res.json({ ok: true, data: editsoliViatic })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}



export const deleteViatic = async (req, res) => {
    try {
        const { viaticId } = req.params
        const deletedViatic = await ViaticModel.deleteViatic(viaticId)
        res.json({ ok: true, data: deletedViatic })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}