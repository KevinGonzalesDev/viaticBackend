import pool from '../db/db.js'

export const ViaticRatesModel = {

  // listado de funciones para conceptos viaticos

  listviaticConcepts: async () => {
    const { rows } = await pool.query(`
      SELECT * FROM viatic_concepts ORDER BY description
    `)
    return rows
  },

  addViaticConcept: async description => {
    const { rows } = await pool.query(`
      INSERT INTO viatic_concepts (description)
      VALUES ($1)
      RETURNING *
    `, [description])
    return rows[0]
  },

  editViaticConcept: async (conceptId, description) => {
    const { rows } = await pool.query(`
      UPDATE viatic_concepts SET
        description = $1
      WHERE id = $2
      RETURNING *
    `, [description, conceptId])
    return rows[0]
  },

  deleteViaticConcept: async id => {
    await pool.query(`DELETE FROM viatic_concepts WHERE id = $1`, [id])
  },

  // listado de funciones para tarifas viaticos
  listViaticrates: async () => {
    const { rows } = await pool.query(`
          SELECT
      vr.id,
      vr.amount,
      vr.frequency_type,
      vr.frequency,
      vr.active,

      d.id   AS district_id,
      d.name AS district_name,

      c.id   AS concept_id,
      c.description AS concept_name
    FROM viatic_rates vr
    JOIN districts d ON d.id = vr.district_id
    JOIN viatic_concepts  c ON c.id = vr.concept_id
    ORDER BY d.name, c.description;
    `)
    return rows
  },


  createViaticRate: async data => {
    const { rows } = await pool.query(`
      INSERT INTO viatic_rates
      (district_id, concept_id, amount, frequency_type, frequency)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      data.districtId,
      data.conceptId,
      data.amount,
      data.frequencyType,
      data.frequency,
    ])

    return rows[0]
  },

  updateViaticRate: async (data) => {
    console.log(data)
    const { rows } = await pool.query(`
      UPDATE viatic_rates SET
      concept_id = $1,
      amount = $2,
      frequency_type = $3,
      frequency = $4
      WHERE id = $5
      RETURNING *
    `, [
      data.conceptId,
      data.amount,
      data.frequencyType,
      data.frequency,
      data.id,
    ])
    console.log(data)
    return rows[0]
  },

  desactivateViaticRate: async (id, active) => {
    const { rows } = await pool.query(`
      UPDATE viatic_rates SET
        active = $1
      WHERE id = $2
      RETURNING *
    `, [active, id])
    return rows[0]

  },



  deleteViaticRate: async id => {
    await pool.query(`DELETE FROM viatic_rates WHERE id = $1`, [id])
  },
}
