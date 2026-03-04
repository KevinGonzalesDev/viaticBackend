import { Router } from 'express'
import {
    listClients,
    addClient,
    editClient,
    desactivateClient,
    deleteClient,
    listUbications,
    addUbication,
    editUbication,
    desactivateUbication,
    deleteUbication,
    listUbicationsWId,
    listProyects,
    addProyect,
    editProyect,
    deleteProyect,
    desactivateProyect,
    listProyectsWClientId
} from '../controllers/proyects.controller.js'

const router = Router()

// rutas de clientes
router.get('/clients', listClients)
router.post('/clients', addClient)
router.put('/clients', editClient)
router.put('/clients/desactivate/:id', desactivateClient)
router.delete('/clients/:id', deleteClient)

// rutas de ubicaciones
router.get('/ubications', listUbications)
router.post('/ubications', addUbication)
router.put('/ubications', editUbication)
router.put('/ubications/desactivate/:id', desactivateUbication)
router.delete('/ubications/:id', deleteUbication)
router.get('/ubications/:clientId', listUbicationsWId)

// rutas de los proyectos
router.post('/', addProyect)
router.get('/', listProyects)
router.put('/', editProyect)
router.delete('/:id', deleteProyect)
router.put('/desactivate/:id', desactivateProyect)

router.get('/client/:clientId', listProyectsWClientId)


export default router
