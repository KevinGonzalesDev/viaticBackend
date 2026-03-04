import pool from '../db/db.js'

export const ProyectsModel = {

  // acciones para cliente

  ListClients: async () => {
    const { rows } = await pool.query(`
      SELECT * FROM public.clients
        ORDER BY id ASC LIMIT 100
    `)
    return rows
  },

  AddClient: async (name) => {
    const { rows } = await pool.query(`
      INSERT INTO public.clients (name)
      VALUES ($1)
      RETURNING *
    `, [name])
    return rows[0]
  },

  editClient: async (data) => {
    const { rows } = await pool.query(`
      UPDATE public.clients
      SET name = $1
      WHERE id = $2
      RETURNING *
    `, [data.name, data.id])
    return rows[0]
  },

  desactivateClient: async (id, active) => {
    const { rows } = await pool.query(`
      UPDATE public.clients
      SET active = $1
      WHERE id = $2
      RETURNING *
    `, [active, id])
    return rows[0]
  },

  deleteClient: async (id) => {
    const { rows } = await pool.query(`
      DELETE FROM public.clients
      WHERE id = $1
      RETURNING *
    `, [id])
    return rows[0]
  },

  // acciones para ubicactiones de cliente

  ListUbication: async () => {
    const { rows } = await pool.query(`
            SELECT
        l.id,
        l.client_id,
        c.name AS client_name,
        l.name AS location_name,
        l.address,
        l.district_id,
        d.name AS district_name,
        l.active
      FROM public.client_locations l
      INNER JOIN public.clients c
        ON l.client_id = c.id
      INNER JOIN public.districts d
        ON l.district_id = d.id
      ORDER BY l.id ASC
      LIMIT 100;
    `)
    return rows
  },

  Addubication: async (data) => {
    const { rows } = await pool.query(`
      INSERT INTO public.client_locations (client_id, name, address, district_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [data.clientId, data.name, data.address, data.districtId])
    return rows[0]
  },

  editUbication: async (data) => {
    console.log(data)
    const { rows } = await pool.query(`
      UPDATE public.client_locations
      SET client_id = $1, name = $2, address = $3, district_id = $4
      WHERE id = $5
      RETURNING *
    `, [data.clientId, data.name, data.address, data.districtId, data.id])
    return rows[0]
  },

  DesactivateUbication: async (id, active) => {
    const { rows } = await pool.query(`
      UPDATE public.client_locations
      SET active = $1
      WHERE id = $2
      RETURNING *
    `, [active, id])
    return rows[0]
  },

  deleteUbication: async (id) => {
    const { rows } = await pool.query(`
      DELETE FROM public.client_locations
      WHERE id = $1`, [id])
  },

  ListUbicationsWId: async (clientId) => {
    const { rows } = await pool.query(`
      SELECT  c.id,
        c.client_id,
        c.name AS location_name,
        c.address,
        d.name AS district_name
      FROM public.client_locations c
      inner join districts d on c.district_id = d.id
        WHERE client_id = $1

        ORDER BY c.name
    `, [clientId])
    return rows
  },

  // acciones para los proyectos
  ListProyects: async () => {
    const { rows } = await pool.query(`
        SELECT
    p.id,
    p.name AS project_name,
    p.active,
    p.id_companie,

    c.id AS client_id,
    c.name AS client_name,

    l.id AS location_id,
    l.name AS location_name,

    p.cost_center_code
  FROM public.projects p
  INNER JOIN public.clients c
    ON p.client_id = c.id
  INNER JOIN public.client_locations l
    ON p.location_id = l.id
  ORDER BY p.id ASC
  LIMIT 100;
    `)
    return rows
  },


  AddProyect: async (data) => {
    const { rows } = await pool.query(`
      INSERT INTO public.projects (client_id, location_id, cost_center_code, name, id_companie)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [data.clientId, data.locationId, data.costCenter, data.proyectName, data.companyId])
    return rows[0]
  },

  editProyect: async (data) => {
    const { rows } = await pool.query(`
      UPDATE public.projects
      SET client_id = $1, location_id = $2, cost_center_code = $3, name = $4, id_companie = $5
      WHERE id = $6
      RETURNING *
    `, [data.clientId, data.locationId, data.costCenter, data.proyectName, data.companyId, data.id])
    return rows[0]
  },

  desactivateProyect: async (id, active) => {
    const { rows } = await pool.query(`
      UPDATE public.projects
      SET active = $1
      WHERE id = $2
      RETURNING *
    `, [active, id])
    return rows[0]
  },

  deleteProyect: async (id) => {
    const { rows } = await pool.query(`
      DELETE FROM public.projects
      WHERE id = $1
      RETURNING *
    `, [id])
    return rows[0]
  },


  ListProyectWClientId: async (clientId) => {
    const { rows } = await pool.query(`
      SELECT * 
      FROM public.projects
        WHERE client_id = $1
        ORDER BY name
    `, [clientId])
    return rows
  },

}
