import pool from '../db/db.js'

export const BankAccountModel = {


    getBankAccountsByOwner: async (ownerType, ownerId) => {
        const { rows } = await pool.query(`
      SELECT * FROM public.bank_accounts
      WHERE owner_type = $1 AND owner_id = $2
    `, [ownerType, ownerId])

        return rows
    },

    AddBankAccount: async data => {
        const { rows } = await pool.query(`
      INSERT INTO public.bank_accounts
      (owner_type, owner_id, bank_name, account_number, cci, currency, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
            data.ownerType,
            data.ownerId,
            data.bankName,
            data.accountNumber,
            data.cci,
            data.currency,
            data.status
        ])

        return rows[0]
    },

    EditBankAccount: async data => {
        const query = `
    UPDATE public.bank_accounts SET
      owner_type = $1,
      owner_id = $2,
      bank_name = $3,
      account_number = $4,
      cci = $5,
      currency = $6,
      status = $7
    WHERE id = $8
    RETURNING *`

        const values = [
            data.ownerType,
            data.ownerId,
            data.bankName,
            data.accountNumber,
            data.cci,
            data.currency,
            data.status,
            data.bankId
        ]

        const { rows } = await pool.query(query, values)
        return rows[0]
    },

    deleteBankAccount: async bankId => {
        const { rows } = await pool.query(`
      DELETE FROM public.bank_accounts
      WHERE id = $1
      RETURNING *
    `, [bankId])

        return rows[0]
    },



    desactivateBankAccount: async (id, active) => {
        const { rows } = await pool.query(`
      UPDATE public.bank_accounts
        SET status = $1
        WHERE id = $2
        RETURNING *
    `, [active, id])
        return rows[0]
    },


}