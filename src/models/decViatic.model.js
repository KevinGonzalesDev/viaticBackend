import pool from '../db/db.js'

export const DeclarModel = {

    ListDeclarUs: async (userId) => {
        const { rows } = await pool.query(`
SELECT viatics.code as viatic_code,
			viatics.id as viatic_id,
             c.name AS client_name,
			 l.name AS location_name,
			 p.name AS proyect_name,
             p.cost_center_code as project_code,
			 d.name as district_name,
             b.amount_total AS budget_total,
             b.id as budget_id,
             COALESCE(dp.deposit_amount, 0) AS deposit_amount,
			 COALESCE(ex.declare_amount, 0) AS declare_amount
			 
			 
      FROM public.viatics
      left join viatic_budgets b on viatics.id = b.viatic_id
	  
      LEFT JOIN (
        SELECT viatic_id, SUM(amount) AS deposit_amount
        FROM public.viatic_deposits
        GROUP BY viatic_id
    ) dp ON viatics.id = dp.viatic_id
	LEFT JOIN( SELECT viatic_id, SUM(amount) AS declare_amount
	FROM public.viatic_expenses GROUP BY viatic_id) ex ON viatics.id = ex.viatic_id
      inner JOIN public.employees u ON viatics.user_id = u.id
      inner JOIN public.clients c ON viatics.client_id = c.id
      inner join public.projects p on viatics.proyect_id = p.id
      left JOIN public.client_locations l ON p.location_id = l.id
	  inner join public.districts d on l.district_id = d.id
        WHERE viatics.status = 'APROB_TESO' AND viatics.user_id = $1
        ORDER BY viatics.id DESC`, [userId])
        return rows
    },

    getViaticDetail: async (viaticId) => {
        const { rows } = await pool.query(`
       SELECT 
        v.id AS viatic_id,
	  	v.code AS viatic_code,
        v.new_code AS viatic_new_code,
		v.type,
		v.new_code AS viatic_new_code,
		p.cost_center_code AS cost_center,
		e.first_name AS user_name,
		e.last_name AS user_lastname,
		e.dni AS user_dni,
		e.area AS user_area,
	  	p.name AS proyect_name,
		l.name AS location_name,
		v.start_mov AS viatic_start,
		v.end_mov AS viatic_end,
        v.start_prov_date as start_prov_date,
		v.end_prov_date as end_prov_date
	    FROM public.viatics v
		INNER JOIN projects p on v.proyect_id = p.id 
		INNER JOIN employees e on v.user_id = e.id
		INNER JOIN client_locations l on p.location_id = l.id
        WHERE  v.id = $1
        LIMIT 1`, [viaticId])

        return rows[0] || null
    },

    getViaticItems: async (viaticId) => {
        const { rows } = await pool.query(`
		SELECT
    di.id,
    di.document_type,
    di.document_number,
    di.expense_date,
    di.expense_real_date,
    di.amount,
    di.travel_from,
    di.travel_to,
    di.payment_method,
    di.is_active,

    json_build_object(
        'id', e.id,
        'document_type', e.document_type,
        'category', e.category,
        'label', e.label,
        'is_active', e.is_active
    ) AS optionObject

FROM public.viatic_expenses di
INNER JOIN public.viatic_expense_options e 
    ON di.expense_option_id = e.id
WHERE di.viatic_id = $1
ORDER BY di.expense_date DESC`, [viaticId])

        return rows
    },

    addViaticExpense: async (data) => {
        console.log(data);

        const { rows } = await pool.query(`
        INSERT INTO public.viatic_expenses (
        viatic_id,
        document_type,
        expense_option_id,
        document_number,
        expense_date,
        expense_real_date,
        amount,
        payment_method,
        travel_from,
        travel_to,
        is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, true)
        RETURNING *`, [
            data.viaticId,
            data.documentType,
            data.optionObject.id,
            data.documentNumber,
            data.expenseDate,
            data.expenseRealDate,
            data.amount,
            data.paymentMethod,
            data.travelFrom,
            data.travelTo,
        ])

        return rows[0]
    },

    editViaticExpense: async (data) => {
        const { rows } = await pool.query(`
        UPDATE public.viatic_expenses
        SET document_type = $2,
            expense_option_id = $3,
            document_number = $4,
            expense_date = $5,
            expense_real_date = $6,
            amount = $7,
            payment_method = $8,
            travel_from = $9,
            travel_to = $10
        WHERE id = $1
        RETURNING *`, [
            data.declareId,
            data.documentType,
            data.optionObject.id,
            data.documentNumber,
            data.expenseDate,
            data.expenseRealDate,
            data.amount,
            data.paymentMethod,
            data.travelFrom,
            data.travelTo,
        ])

        return rows[0]
    },

    deleteViaticExpense: async (expenseId) => {
        const { rows } = await pool.query(`
          delete from public.viatic_expenses  
            WHERE id = $1
        RETURNING *`, [expenseId])
        return rows[0]
    },

    desactivateViatic: async (viaticId) => {
        const { rows } = await pool.query(`
        UPDATE public.viatics
        SET status = 'ANULADO'
        WHERE id = $1
        RETURNING *`, [viaticId])

        return rows[0]
    },

    editViaticDates: async (data) => {
        console.log(data);

        const { rows } = await pool.query(`
        UPDATE public.viatics
        SET fecha_llegada = $2,
            fecha_salida = $3
        WHERE id = $1
        RETURNING *`, [data.viaticId, data.fechaLlegada, data.fechaSalida])

        return rows[0]
    },


    // configuraciones para listado de opciones

    getLiquidationConfigurations: async () => {
        const { rows } = await pool.query(`
        SELECT 
        id,
        document_type AS document_type,
        category AS category,
        label AS label,
        is_active AS is_active
        FROM public.viatic_expense_options
        ORDER BY id DESC`)

        return rows
    },

    addLiquidationConfiguration: async (data) => {
        const { rows } = await pool.query(`
        INSERT INTO public.viatic_expense_options (document_type, category, label, is_active)
        VALUES ($1, $2, $3, true)
        RETURNING *`, [data.documentType, data.category, data.label])

        return rows[0]
    },

    editLiquidationConfiguration: async (data) => {
        const { rows } = await pool.query(`
        UPDATE public.viatic_expense_options
        SET document_type = $2,
            category = $3,
            label = $4,
            is_active = $5
        WHERE id = $1
        RETURNING *`, [data.id, data.documentType, data.category, data.label, data.is_active])

        return rows[0]
    },

    getLiquidationConfigurationsWtype: async (type) => {
        const { rows } = await pool.query(`
        SELECT 
        id,
        document_type AS document_type,
        category AS category,
        label AS label,
        is_active AS is_active
        FROM public.viatic_expense_options
        WHERE document_type = $1
        ORDER BY id DESC`, [type])

        return rows
    },


    // obtener datos para generar PDF

    getViaticInfoPDFData: async (viaticId) => {
        const { rows } = await pool.query(`
        SELECT 
    v.end_mov AS presentation_date,
    e.dni AS codigo_trabajador,
    v.code AS presentacion,
    v.new_code AS new_code,
    CONCAT(e.first_name, ' ', e.last_name) AS nombre_completo,
    v.status AS estado,
    p.name AS proyect_name,
    p.cost_center_code AS centro_costo,
    c.name AS client_name,
    l.name AS planta_name,
    v.start_mov,
    v.end_mov,
    v.type,
   v.start_prov_date AS arrive_date,
    v.end_prov_date AS exit_date,


    (
        SELECT COALESCE(json_agg(
            json_build_object(
                'voucher', d.nro_voucher,
                'fecha', d.date_deposit,
                'monto', d.amount
            )
        ), '[]')
        FROM viatic_deposits d
        WHERE d.viatic_id = v.id
    ) AS depositos

FROM public.viatics v
INNER JOIN employees e ON v.user_id = e.id
INNER JOIN projects p ON v.proyect_id = p.id
INNER JOIN clients c ON p.client_id = c.id
INNER JOIN client_locations l ON p.location_id = l.id
WHERE v.id = $1`, [viaticId])

        return rows[0]
    },

    getViaticLiquidationData: async (viaticId) => {
        const { rows } = await pool.query(`
       SELECT 
        v.new_code AS nro_viaje,
        p.cost_center_code AS centro_costo,
		v.type,
        CONCAT(e.first_name, ' ', e.last_name) AS nombre_completo,
        e.dni AS codigo_trabajador,
        e.area AS area_employ,
        p.name AS proyect_name,
        c.name AS client_name,
        l.name AS planta_name,
        v.end_mov AS presentation_date,
        v.status AS estado,
		v.aproved_date,
        v.start_mov,
        v.end_mov,

     (
    SELECT COALESCE(
        json_agg(
            json_build_object(
                'document', ex.document_number,
                'fecha', ex.expense_date,
                'description', o.label,
                'category', o.category,
                'amount', ex.amount
            )
            ORDER BY ex.expense_date ASC
        ),
        '[]'
    )
    FROM viatic_expenses ex
    INNER JOIN viatic_expense_options o 
        ON ex.expense_option_id = o.id
    WHERE ex.viatic_id = v.id 
      AND ex.document_type = 'LIQUIDACION'
) AS declarations,

(
    SELECT COALESCE(SUM(ex.amount), 0)
    FROM viatic_expenses ex
    INNER JOIN viatic_expense_options o 
        ON ex.expense_option_id = o.id
    WHERE ex.viatic_id = v.id 
      AND ex.document_type = 'MOVILIDAD'
) AS movility_amount,

        (
            SELECT COALESCE(
                json_agg(
                    json_build_object(
						'bank_name',ba.bank_name,
						'origin',ba.account_number,
						'cci',ba.cci,
						'currency',ba.currency,
                        'code', d.code,
                        'amount', d.amount
                    )
                ),
                '[]'
            )
            FROM viatic_deposits d
			INNER JOIN bank_accounts ba ON ba.id = d.origin_id
            WHERE d.viatic_id = v.id 
        ) AS deposits

        

    FROM public.viatics v
    INNER JOIN employees e ON v.user_id = e.id
    INNER JOIN projects p ON v.proyect_id = p.id
    INNER JOIN clients c ON p.client_id = c.id
	
    INNER JOIN client_locations l ON p.location_id = l.id
    WHERE v.id = $1`, [viaticId])

        return rows[0]
    },

    getViaticMovilityData: async (viaticId) => {
        const { rows } = await pool.query(`
         SELECT 
        v.code AS nro_viaje,
        CONCAT(e.first_name, ' ', e.last_name) AS nombre_completo,
        e.dni AS codigo_trabajador,
        v.end_mov AS presentation_date,
        v.status AS estado,
        v.start_mov,
        v.end_mov,

     (
    SELECT COALESCE(
        json_agg(
            json_build_object(
                'fecha', ex.expense_date,
                'description', o.label,
                'category', o.category,
				'origin' , ex.travel_from,
				'destiny', ex.travel_to,
                'amount', ex.amount
            )
            ORDER BY ex.expense_date ASC
        ),
        '[]'
    )
    FROM viatic_expenses ex
    INNER JOIN viatic_expense_options o 
        ON ex.expense_option_id = o.id
    WHERE ex.viatic_id = v.id 
      AND ex.document_type = 'MOVILIDAD'
) AS declarations


        

    FROM public.viatics v
    INNER JOIN employees e ON v.user_id = e.id
    WHERE v.id = $1;`, [viaticId])

        return rows[0]
    },

}