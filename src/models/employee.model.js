// src/models/employee.model.js
import pool from '../db/db.js'

export const createEmployee = async (data) => {
  const query = `
    INSERT INTO employees (
      avatar_img, first_name, last_name, dni, position,
      firm_position, area, phone, email, password_hash, active
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
  `

  const values = [
    data.avatarImg || null,
    data.first_name || null,
    data.last_name || null,
    data.dni || null,
    data.position || null,
    data.firm_position || null,
    data.area || null,
    data.phone || null,
    data.email || null,
    data.password_hash || null,
    data.active || false
  ]

  const { rows } = await pool.query(query, values)
  return rows[0]
}

export const listEmployees = async () => {
  const { rows } = await pool.query('SELECT * FROM employees ORDER BY id DESC')
  return rows
}

export const updateEmployeeM = async (id, data) => {
  const query = `
    UPDATE employees SET
      first_name = $1,
      last_name = $2,
      dni = $3,
      position = $4,
      firm_position = $5,
      area = $6,
      phone = $7,
      email = $8,
      avatar_img = COALESCE($9, avatar_img),
      password_hash = COALESCE($10, password_hash),
      active = $11
    WHERE id = $12
    RETURNING *
  `

  const values = [
    data.first_name,
    data.last_name,
    data.dni,
    data.position,
    data.firm_position,
    data.area,
    data.phone,
    data.email,
    data.avatar_img ?? null,
    data.password_hash ?? null,
    data.active,
    id,
  ]

  const { rows } = await pool.query(query, values)
  return rows[0]
}

export const findEmployeeById = async id => {
  const { rows } = await pool.query(
    'SELECT * FROM employees WHERE id = $1',
    [id]
  )
  return rows[0]
}

export const deleteEmployeeM = async id => {
  await pool.query('DELETE FROM employees WHERE id = $1', [id])
}