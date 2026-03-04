import { CompaniesModel } from '../models/companies.model.js'

export const listAllCompanies = async (req, res) => {
    try {
        const companies = await CompaniesModel.ListAllCompanies()
        res.json({ ok: true, data: companies })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const listCompaniesSelect = async (req, res) => {
    try {
        console.log('entro en el controlador');

        const companies = await CompaniesModel.listCompaniesSelect()
        res.json({ ok: true, data: companies })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const getCompanyById = async (req, res) => {
    const { companyId } = req.params
    try {
        const company = await CompaniesModel.GetCompanyById(companyId)
        if (company) {
            res.json({ ok: true, data: company })
        } else {
            res.status(404).json({ ok: false, error: 'Company not found' })
        }
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const addCompany = async (req, res) => {
    const data = req.body
    try {
        const newCompany = await CompaniesModel.AddCompany(data)
        res.json({ ok: true, data: newCompany })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const editCompany = async (req, res) => {
    const data = req.body
    try {
        const updatedCompany = await CompaniesModel.EditCompany(data)
        res.json({ ok: true, data: updatedCompany })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}