
import pool from '../db/db.js'

export const listEmployeesWithRoles = async () => {
  const { rows } = await pool.query(`
 SELECT
      e.id,
      e.first_name,
      e.last_name,
      e.email,
      e.active,
	  e.position,
	  

      COALESCE(
        ARRAY_AGG(DISTINCT r.description) FILTER (WHERE r.description IS NOT NULL),
        '{}'
      ) AS roles,

      COALESCE(
        ARRAY_AGG(DISTINCT r.id) FILTER (WHERE r.id IS NOT NULL),
        '{}'
      ) AS role_ids

    FROM employees e
    LEFT JOIN user_roles ur ON ur.employee_id = e.id
    LEFT JOIN roles r ON r.id = ur.role_id
    GROUP BY e.id
    ORDER BY e.first_name
  `)

  return rows
}
export const getAllRoles = async () => {
  const { rows } = await pool.query(`
    SELECT id, name ,description
    FROM roles
    ORDER BY name
  `)

  return rows
}

export const updateUserRoles = async (employeeId, roleIds) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // 1️⃣ borrar roles actuales
    await client.query(
      'DELETE FROM user_roles WHERE employee_id = $1',
      [employeeId]
    )

    // 2️⃣ insertar nuevos roles
    for (const roleId of roleIds) {
      await client.query(
        'INSERT INTO user_roles (employee_id, role_id) VALUES ($1, $2)',
        [employeeId, roleId]
      )
    }

    await client.query('COMMIT')
    return true
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}