import { ProyectsModel } from '../models/proyects.model.js'

// clientes controllers
export const listClients = async (req, res) => {
    try {
        const clients = await ProyectsModel.ListClients()
        res.json({ ok: true, data: clients })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}
export const addClient = async (req, res) => {
    try {
        const { name } = req.body
        const newClient = await ProyectsModel.AddClient(name)
        res.json({ ok: true, data: newClient })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}
export const editClient = async (req, res) => {
    try {
        const data = req.body
        const updatedClient = await ProyectsModel.editClient(data)
        res.json({ ok: true, data: updatedClient })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}
export const desactivateClient = async (req, res) => {
    try {
        const { id } = req.params
        const { active } = req.body
        const client = await ProyectsModel.desactivateClient(id, active)
        res.json({ ok: true, data: client })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params
        const deletedClient = await ProyectsModel.deleteClient(id)
        res.json({ ok: true, data: deletedClient })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

// ubications controllers
export const listUbications = async (req, res) => {
    try {
        const ubications = await ProyectsModel.ListUbication()
        res.json({ ok: true, data: ubications })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const addUbication = async (req, res) => {
    try {
        const data = req.body
        const newUbication = await ProyectsModel.Addubication(data)
        res.json({ ok: true, data: newUbication })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const editUbication = async (req, res) => {
    try {
        const data = req.body
        const updatedUbication = await ProyectsModel.editUbication(data)
        res.json({ ok: true, data: updatedUbication })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const desactivateUbication = async (req, res) => {
    try {
        const { id } = req.params
        const { active } = req.body
        const ubication = await ProyectsModel.DesactivateUbication(id, active)
        res.json({ ok: true, data: ubication })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteUbication = async (req, res) => {
    try {
        const { id } = req.params
        const deletedUbication = await ProyectsModel.deleteUbication(id)
        res.json({ ok: true, data: deletedUbication })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}



export const listUbicationsWId = async (req, res) => {
    try {
        const { clientId } = req.params
        const ubications = await ProyectsModel.ListUbicationsWId(clientId)
        res.json({ ok: true, data: ubications })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}



// proyects controllers

export const listProyects = async (req, res) => {
    try {
        const proyects = await ProyectsModel.ListProyects()
        res.json({ ok: true, data: proyects })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const addProyect = async (req, res) => {
    try {
        const data = req.body
        const newProyect = await ProyectsModel.AddProyect(data)
        res.json({ ok: true, data: newProyect })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const editProyect = async (req, res) => {
    try {
        const data = req.body
        const updatedProyect = await ProyectsModel.editProyect(data)
        res.json({ ok: true, data: updatedProyect })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const desactivateProyect = async (req, res) => {
    try {
        const { id } = req.params
        const { active } = req.body
        const proyect = await ProyectsModel.desactivateProyect(id, active)
        res.json({ ok: true, data: proyect })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteProyect = async (req, res) => {
    try {
        const { id } = req.params
        const deletedProyect = await ProyectsModel.deleteProyect(id)
        res.json({ ok: true, data: deletedProyect })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}



export const listProyectsWClientId = async (req, res) => {
    try {
        const { clientId } = req.params
        const proyects = await ProyectsModel.ListProyectWClientId(clientId)
        res.json({ ok: true, data: proyects })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}
