import pool from '../db/db.js'

export const BudgetModel = {

    ListAllViaticaproved: async () => {
        const { rows } = await pool.query(`
SELECT viatics.*, 
		     u.first_name AS name,
			 u.last_name AS lastname,
             c.name AS client_name,
			 l.name AS location_name,
			 p.name AS proyect_name,
			 d.name as district_name,
			 d.id as district_id,
             b.amount_total AS budget_total,
             b.aditional,
			 b.days,
             b.id as budget_id,
             COALESCE(dp.deposit_amount, 0) AS deposit_amount
			 
			 
      FROM public.viatics
      left join viatic_budgets b on viatics.id = b.viatic_id
      LEFT JOIN (
        SELECT viatic_id, SUM(amount) AS deposit_amount
        FROM public.viatic_deposits
        GROUP BY viatic_id
    ) dp ON viatics.id = dp.viatic_id
      inner JOIN public.employees u ON viatics.user_id = u.id
      inner JOIN public.clients c ON viatics.client_id = c.id
      inner join public.projects p on viatics.proyect_id = p.id
      left JOIN public.client_locations l ON p.location_id = l.id
	  inner join public.districts d on l.district_id = d.id
        WHERE viatics.status = 'APROB_ADMIN' OR viatics.status = 'APROB_TESO'
        ORDER BY viatics.id DESC 
    `)
        return rows
    },

    listCostbyDistrict: async (districtId) => {
        const { rows } = await pool.query(`
       SELECT  
        v.id,
        c.id as concept_id,
        c.description as concept_name,
        v.frequency_type,
        v.frequency,
        c.code,
        v.amount
		FROM public.viatic_rates v
		inner join public.viatic_concepts c on v.concept_id = c.id
        WHERE district_id = $1
      `, [districtId])
        return rows
    },



    addBudgetViatic: async (data) => {
        console.log(data);

        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            // 1️⃣ Insertar presupuesto
            const budgetQuery = `
      INSERT INTO public.viatic_budgets
      (viatic_id, district_id, days, aditional, amount_total, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      
    `

            const budgetValues = [
                data.viaticId,
                data.districtId,
                data.days,
                data.aditional,
                data.totalAmount,
                data.dateCreated,
            ]

            const { rows } = await client.query(budgetQuery, budgetValues)
            const budgetId = rows[0].id

            // 2️⃣ Insertar detalle (budget_items)
            const itemQuery = `
      INSERT INTO public.budget_items
      (budget_id, concept_id, frequency_type, frequency, amount, subtotal)
      VALUES ($1, $2, $3, $4, $5, $6)
    `

            for (const item of data.items) {
                await client.query(itemQuery, [
                    budgetId,
                    item.concept_id,
                    item.frequency_type,
                    item.frequency,
                    item.amount,
                    item.subtotal,
                ])
            }

            // 3️⃣ Actualizar estado del viático
            await client.query(
                `UPDATE public.viatics SET status = 'APROB_TESO' WHERE id = $1`,
                [data.viaticId]
            )

            await client.query('COMMIT')
            return { budgetId }

        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    },

    listBudgetItems: async (budgetId) => {
        const { rows } = await pool.query(`
       SELECT b.id,
 		b.budget_id,
		b.concept_id,
		b.frequency_type,
		b.amount,
		b.frequency,
		b.subtotal,
		vc.description as concept_name
      FROM public.budget_items b
      INNER JOIN public.viatic_concepts vc ON b.concept_id = vc.id
      WHERE b.budget_id = $1

    `, [budgetId])
        return rows
    },

    editBudgetViatic: async (data) => {
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            // 1️⃣ Actualizar cabecera
            await client.query(`
      UPDATE public.viatic_budgets
      SET days = $1,
          aditional = $2,
          amount_total = $3,
          updated_at = NOW()
      WHERE viatic_id = $4
    `, [
                data.days,
                data.aditional,
                data.totalAmount,
                data.viaticId,
            ])

            // 2️⃣ Obtener budget_id
            const { rows } = await client.query(`
      SELECT id FROM public.viatic_budgets
      WHERE viatic_id = $1
    `, [data.viaticId])

            const budgetId = rows[0].id

            // 3️⃣ Borrar detalle anterior
            await client.query(`
      DELETE FROM public.budget_items
      WHERE budget_id = $1
    `, [budgetId])

            // 4️⃣ Insertar detalle actualizado
            for (const item of data.items) {
                await client.query(`
        INSERT INTO public.budget_items
        (budget_id, concept_id, frequency_type, frequency, amount, subtotal)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
                    budgetId,
                    item.concept_id,
                    item.frequency_type,
                    item.frequency,
                    item.amount,
                    item.subtotal,
                ])
            }

            await client.query('COMMIT')
            return { budgetId }

        } catch (err) {
            await client.query('ROLLBACK')
            throw err
        } finally {
            client.release()
        }
    }
}