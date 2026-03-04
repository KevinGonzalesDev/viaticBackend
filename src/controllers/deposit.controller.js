import { DepositModel } from '../models/deposit.model.js'

export const addDepositViatic = async (req, res) => {
    const data = req.body
    try {
        const newDeposit = await DepositModel.addDepositViatic(data)
        res.json({ ok: true, data: newDeposit })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const editDepositViatic = async (req, res) => {
    const data = req.body
    try {
        const updatedDeposit = await DepositModel.editDepositViatic(data)
        res.json({ ok: true, data: updatedDeposit })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const getDepositsByViaticId = async (req, res) => {
    const { viaticId } = req.params
    console.log("Controller", viaticId);
    try {
        const deposits = await DepositModel.getDepositsByViaticId(viaticId)
        res.json({ ok: true, data: deposits })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const getDepositcountByViaticId = async (req, res) => {
    const { viaticId } = req.query
    const { date } = req.query
    try {
        const depositCount = await DepositModel.getDepositcountByViaticId(viaticId, date)
        res.json({ ok: true, data: Number(depositCount) })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const changeViaticCode = async (req, res) => {
    const { viaticId } = req.params
    const { code } = req.body
    try {
        const updatedViatic = await DepositModel.editViaticCode(viaticId, code)
        res.json({ ok: true, data: updatedViatic })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteDepositViatic = async (req, res) => {
    const { depositId } = req.params
    try {
        const deletedDeposit = await DepositModel.deleteDepositViatic(depositId)
        res.json({ ok: true, data: deletedDeposit })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}