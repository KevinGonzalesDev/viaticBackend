import { BudgetModel } from '../models/budget.model.js'

export const listApprovedViatics = async (req, res) => {
    try {
        const viatics = await BudgetModel.ListAllViaticaproved()
        res.json({ ok: true, data: viatics })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const listCostByDistrict = async (req, res) => {
    const { districtId } = req.params
    try {
        const costs = await BudgetModel.listCostbyDistrict(districtId)
        res.json({ ok: true, data: costs })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const addBudgetViatic = async (req, res) => {
    const data = req.body
    try {
        const newBudget = await BudgetModel.addBudgetViatic(data)
        res.json({ ok: true, data: newBudget })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const listBudgetItems = async (req, res) => {
    const { budgetId } = req.params
    try {
        const items = await BudgetModel.listBudgetItems(budgetId)
        res.json({ ok: true, data: items })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const editBudgetViatic = async (req, res) => {
    const data = req.body
    try {
        const updatedBudget = await BudgetModel.editBudgetViatic(data)
        res.json({ ok: true, data: updatedBudget })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}
