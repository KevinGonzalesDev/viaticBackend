import pool from '../db/db.js'

export const ViaticModel = {

  ListAllViatic: async () => {
    const { rows } = await pool.query(`
       SELECT 
	  v.id,
	  v.user_id,
    u.first_name AS user_name,
    u.last_name AS user_lastname,
	  v.client_id,
	  v.proyect_id,
    p.cost_center_code AS project_code,
    p.name AS project_name,
	  l.id AS location_id,
    l.name AS location_name,
	  v.type,
	  v.start_mov,
	  v.end_mov,
	  v.start_prov_date,
	  v.end_prov_date,
	  v.soli_reason,
    c.name AS client_name,
	  v.code,
	  v.status,
      b.id as budget_id,
      b.amount_total AS budget_total,
      COALESCE(dp.deposit_amount, 0) AS deposit_amount
      FROM public.viatics v
      LEFT JOIN viatic_budgets b on v.id = b.viatic_id
      LEFT JOIN (
        SELECT viatic_id, SUM(amount) AS deposit_amount
        FROM public.viatic_deposits
        GROUP BY viatic_id
    ) dp ON v.id = dp.viatic_id
      inner JOIN public.employees u ON v.user_id = u.id
      inner JOIN public.clients c ON v.client_id = c.id
      left join public.projects p ON v.proyect_id = p.id
      left JOIN public.client_locations l ON p.location_id = l.id;
    `)
    return rows
  },

  ListViaticbyID: async (userId) => {
    const { rows } = await pool.query(`
     SELECT 
	  v.id,
	  v.user_id,
      u.first_name AS user_name,
      u.last_name AS user_lastname,
	  v.client_id,
	  v.proyect_id,
      p.name AS project_name,
	  l.id AS location_id,
      l.name AS location_name,
	  v.type,
	  v.start_mov,
	  v.end_mov,
	  v.start_prov_date,
	  v.end_prov_date,
	  v.soli_reason,
      c.name AS client_name,
	  v.code,
	  v.status,
      b.id as budget_id,
      b.amount_total AS budget_total,
      COALESCE(dp.deposit_amount, 0) AS deposit_amount
      FROM public.viatics v
      LEFT JOIN viatic_budgets b on v.id = b.viatic_id
      LEFT JOIN (
        SELECT viatic_id, SUM(amount) AS deposit_amount
        FROM public.viatic_deposits
        GROUP BY viatic_id
    ) dp ON v.id = dp.viatic_id
      inner JOIN public.employees u ON v.user_id = u.id
      inner JOIN public.clients c ON v.client_id = c.id
      left join public.projects p ON v.proyect_id = p.id
      left JOIN public.client_locations l ON p.location_id = l.id
        WHERE v.user_id = $1
    `, [userId])
    return rows
  },


  getViaticcountByUserId: async (userId, date, excludeId) => {
    const { rows } = await pool.query(`
      SELECT COUNT(*) AS viatic_count
      FROM public.viatics
      WHERE user_id = $1 
      AND   start_mov::date = $2
      AND ($3::int IS NULL OR id <> $3)
    `, [userId, date, excludeId])
    return rows[0].viatic_count
  },


  addViatic: async data => {
    console.log(data, 'data viatic en modelo');

    const { rows } = await pool.query(`
      INSERT INTO public.viatics
      (user_id, client_id, proyect_id, type, start_mov, end_mov, start_prov_date, end_prov_date, soli_reason, status ,presentation_date , code)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9 ,$10, $11, $12)
      RETURNING *
    `, [
      data.userId,
      data.clientId,
      data.projectId,
      data.type,
      data.startMovdate,
      data.endMovdate,
      data.startProvDate,
      data.endProvDate,
      data.soliReason,
      'SOLICITED',
      data.presentationDate,
      data.codeViatic,
    ])

    return rows[0]
  },

  editsoliViatic: async data => {
    const query = `
    UPDATE public.viatics SET
      client_id = $1,
      proyect_id = $2,
      type = $3,
      presentation_date = $4,
      start_mov = $5,
      end_mov = $6,
      start_prov_date = $7,
      end_prov_date = $8,
      soli_reason = $9
    WHERE id = $10
    RETURNING *`

    const values = [
      data.clientId,
      data.projectId,
      data.type,
      data.presentationDate,
      data.startMovdate,
      data.endMovdate,
      data.startProvDate,
      data.endProvDate,
      data.soliReason,
      data.viaticId
    ]

    const { rows } = await pool.query(query, values)
    return rows[0]
  },


  deleteViatic: async viaticId => {
    const { rows } = await pool.query(`
      DELETE FROM public.viatics
        WHERE id = $1
      RETURNING *
    `, [viaticId])

    return rows[0]
  },

  aprobeViatic: async data => {
    console.log(data);
    const { rows } = await pool.query(`
      UPDATE public.viatics
        SET status = $1, aproved_date = $2 , aproved_userid = $3
        WHERE id = $4
      RETURNING *
    `, [
      'APROB_ADMIN',
      data.approvalDate,
      data.approvedBy,
      data.viaticId,
    ])

    return rows[0]
  },

  refusedViatic: async data => {
    console.log(data);


    const { rows } = await pool.query(`
      UPDATE public.viatics
        SET status = $1
        WHERE id = $2
      RETURNING *
    `, [
      'REFUSED',
      data.viaticId,
    ])

    return rows[0]
  }
}