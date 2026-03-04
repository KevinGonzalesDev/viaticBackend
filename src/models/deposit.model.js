import pool from '../db/db.js'

export const DepositModel = {



    addDepositViatic: async data => {
        const { rows } = await pool.query(`
      INSERT INTO public.viatic_deposits
      (viatic_id, date_deposit, amount,nro_voucher,type,observation,created_at, created_by, code , origin_id, destiny_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9 ,$10, $11)
      RETURNING *
    `, [
            data.viaticId,
            data.depositDate,
            data.amount,
            data.nmrVoucher,
            data.typeDeposit,
            data.observations,
            data.createdAt,
            data.createdBy,
            data.codeDeposit,
            data.originAccount.id,
            data.destinationAccount.id,
        ])

        return rows[0]
    },

    editDepositViatic: async data => {
        const query = `
    UPDATE public.viatic_deposits SET
      date_deposit = $1,
      amount = $2,
      nro_voucher = $3,
      type = $4,
      observation = $5,
      code = $6,
      origin_id = $7,
      destiny_id = $8
    WHERE id = $9
    RETURNING *`

        const values = [
            data.depositDate,
            data.amount,
            data.nmrVoucher,
            data.typeDeposit,
            data.observations,
            data.codeDeposit,
            data.originAccount.id,
            data.destinationAccount.id,
            data.depositId
        ]

        const { rows } = await pool.query(query, values)
        return rows[0]
    },

    getDepositsByViaticId: async viaticId => {
        const { rows } = await pool.query(`
       SELECT 
    d.id,
    d.viatic_id,
    d.date_deposit,
    d.amount,
    d.nro_voucher,
    d.type,
    d.observation,
    d.code,

    json_build_object(
        'id', bo.id,
        'owner_id', bo.owner_id,
        'bank_name', bo.bank_name,
        'account_number', bo.account_number,
        'cci', bo.cci,
        'currency', bo.currency
    ) AS origin_account,

    json_build_object(
        'id', bd.id,
        'owner_id', bd.owner_id,
        'bank_name', bd.bank_name,
        'account_number', bd.account_number,
        'cci', bd.cci,
        'currency', bd.currency
    ) AS destiny_account

FROM public.viatic_deposits d

LEFT JOIN bank_accounts bo 
    ON bo.id = d.origin_id

LEFT JOIN bank_accounts bd 
    ON bd.id = d.destiny_id

WHERE d.viatic_id = $1;
    `, [viaticId])
        return rows
    },

    getDepositcountByViaticId: async (viaticId, date) => {
        const { rows } = await pool.query(`
      SELECT COUNT(*) AS deposit_count
      FROM public.viatic_deposits
      WHERE viatic_id = $1 and date_deposit::date = $2;
    `, [viaticId, date])
        return rows[0].deposit_count
    },

    editViaticCode: async (viaticId, code) => {
        const { rows } = await pool.query(`
      UPDATE public.viatics SET
        new_code = $1
      WHERE id = $2
      RETURNING *
    `, [code, viaticId])
        return rows[0]
    },

    deleteDepositViatic: async depositId => {

        const { rows } = await pool.query(`
      DELETE FROM public.viatic_deposits
        WHERE id = $1
      RETURNING *
    `, [depositId])
        return rows[0]
    },


}