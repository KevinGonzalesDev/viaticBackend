import { LocationsModel } from '../models/locations.model.js'

export const listDepartments = async (req, res) => {
    try {
        const departments = await LocationsModel.ListDepartments()
        res.json({ ok: true, data: departments })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}



export const listProvinces = async (req, res) => {
    try {
        const provinces = await LocationsModel.ListProvinces()
        res.json({ ok: true, data: provinces })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const addProvince = async (req, res) => {
    try {
        const province = await LocationsModel.addProvince(req.body)
        res.json({ ok: true, data: province })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const listProvincesWId = async (req, res) => {
    try {
        const provinces = await LocationsModel.ListProvincesWId(req.params.departmentId)
        res.json({ ok: true, data: provinces })
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message })
    }
}

export const listDistrictsWId = async (req, res) => {
    try {
        const districts = await LocationsModel.ListDistricWId(req.params.provinceId)
        res.json({ ok: true, data: districts })
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message })
    }
}

export const listAllDistricts = async (req, res) => {
    try {
        const districts = await LocationsModel.ListAllDistricts()
        res.json({ ok: true, data: districts })
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message })
    }
}

export const desactivateDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const { active } = req.body
        const department = await LocationsModel.DesactivateDepartment(id, active)
        res.json({ ok: true, data: department })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const desactivateProvince = async (req, res) => {
    try {
        const { id } = req.params
        const { active } = req.body
        const province = await LocationsModel.DesactivateProvince(id, active)
        res.json({ ok: true, data: province })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const desactivateDistrict = async (req, res) => {
    try {
        const { id } = req.params
        const { active } = req.body
        const district = await LocationsModel.desactivateDistrict(id, active)
        res.json({ ok: true, data: district })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}


export const createProvince = async (req, res) => {
    try {
        const province = await LocationsModel.createProvince(req.body)
        res.json({ ok: true, data: province })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const createDistrict = async (req, res) => {
    try {
        const district = await LocationsModel.createDistrict(req.body)
        res.json({ ok: true, data: district })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const editProvince = async (req, res) => {
    try {
        const data = req.body
        const province = await LocationsModel.editProvince(data)
        res.json({ ok: true, data: province })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const editDistrict = async (req, res) => {
    try {
        const data = req.body
        const district = await LocationsModel.editDistrict(data)
        res.json({ ok: true, data: district })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteProvince = async (req, res) => {
    try {
        await LocationsModel.deleteProvince(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteDistrict = async (req, res) => {
    try {
        await LocationsModel.deleteDistrict(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}
