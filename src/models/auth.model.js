import pool from '../db/db.js'


export const UserModel = {
    findUserByEmail: async email => {
        const { rows } = await pool.query(
            `SELECT 
        e.id,
        e.email,
        e.password_hash,
        e.first_name,
        e.last_name,
        e.active,
        e.avatar_img,
        COALESCE(
          ARRAY_AGG(r.name) FILTER (WHERE r.name IS NOT NULL),
          '{}'
        ) AS roles
      FROM employees e
      LEFT JOIN user_roles ur ON ur.employee_id = e.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE e.email = $1
      GROUP BY e.id`,
            [email]
        )
        return rows[0]
    },
}

