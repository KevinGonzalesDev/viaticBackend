import { BankAccountModel } from '../models/bank.model.js'

export const getBankAccountsByOwner = async (req, res) => {
    const { ownerType, ownerId } = req.params
    try {
        const bankAccounts = await BankAccountModel.getBankAccountsByOwner(ownerType, ownerId)
        res.json({ ok: true, data: bankAccounts })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const addBankAccount = async (req, res) => {
    const data = req.body
    try {
        const newBankAccount = await BankAccountModel.AddBankAccount(data)
        res.json({ ok: true, data: newBankAccount })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const editBankAccount = async (req, res) => {
    const data = req.body
    try {
        const updatedBankAccount = await BankAccountModel.EditBankAccount(data)
        res.json({ ok: true, data: updatedBankAccount })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteBankAccount = async (req, res) => {
    const { bankId } = req.params
    try {
        await BankAccountModel.deleteBankAccount(bankId)
        res.json({ ok: true, message: 'Bank account deleted successfully' })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const desactivateBankAccount = async (req, res) => {
    try {
        const { id } = req.params
        const { active } = req.body
        const bankAccount = await BankAccountModel.desactivateBankAccount(id, active)
        res.json({ ok: true, data: bankAccount })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

