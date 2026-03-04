import pool from '../db/db.js'

export const CompaniesModel = {

    ListAllCompanies: async () => {
        const { rows } = await pool.query(`
        SELECT
        c.name,
        c.ruc,
        c.address,
        c.phone,
        c.email,
        c.short_name,

        (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'id', b.id,
                        'owner_type', b.owner_type,
                        'owner_id', b.owner_id,
                        'bank_name', b.bank_name,
                        'account_number', b.account_number,
                        'cci', b.cci,
                        'currency', b.currency,
                        'status', b.status
                )
            ), '[]')
            FROM bank_accounts b
            WHERE c.id = b.owner_id
        ) AS bankobject


    FROM public.companies c

    ORDER BY c.id DESC
    `)
        return rows
    },

    listCompaniesSelect: async () => {
        const { rows } = await pool.query(`
        SELECT c.id, c.name, c.short_name FROM public.companies c
    `)
        console.log('rows en el modelo', rows);

        return rows
    },


    AddCompany: async data => {
        const { rows } = await pool.query(`
      INSERT INTO public.companies
      (name, ruc, address, phone, email, created_at, updated_at, created_by, updated_by, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9, $10)
      RETURNING *
    `, [
            data.name,
            data.ruc,
            data.address,
            data.phone,
            data.email,
            data.createdAt,
            data.updatedAt,
            data.createdBy,
            data.updatedBy,
            data.status,
        ])

        return rows[0]
    },

    EditCompany: async data => {
        const query = `
    UPDATE public.companies SET
      name = $1,
      ruc = $2,
      address = $3,
      phone = $4,
      email = $5,
      updated_at = $6,
      updated_by = $7
    WHERE id = $8
    RETURNING *`

        const values = [
            data.name,
            data.ruc,
            data.address,
            data.phone,
            data.email,
            data.updatedAt,
            data.updatedBy,
            data.companyId
        ]

        const { rows } = await pool.query(query, values)
        return rows[0]
    },

    GetCompanyById: async companyId => {
        const { rows } = await pool.query(`
      SELECT *
      FROM public.companies
      WHERE id = $1
    `, [companyId])
        return rows[0]
    },

}