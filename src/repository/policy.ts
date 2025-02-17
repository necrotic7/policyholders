import { database as iDatabase } from "workspace-model/database";
import { Exception as iException } from "workspace-model/exception";
import { Repository as iRepository } from "workspace-model/repository/policy";
import { PolicyData as tPolicyData } from "workspace-model/type/policy";
import oracle from 'oracledb';

class Policy implements iRepository{
    db: iDatabase
    exception: iException

    constructor(database: iDatabase, exception: iException){
        this.db = database;
        this.exception = exception;
    }

    async save(){
        await this.db.commit();
    }

    async getPolicyByCode(id: number): Promise<Record<string, unknown>[]>{
        const TAG = '[透過保單編號取得保單]';
        try{
            const sql = `
                SELECT
                    p.id AS "id",
                    p.description AS "description",
                    p.holder_id AS "holder_code",
                    h.name AS "holder_name",
                    p.premium AS "premium",
                    TO_CHAR(p.create_date, 'YYYY-MM-DD HH24:Mi:SS') AS "create_date"
                FROM POLICY p
                INNER JOIN POLICYHOLDERS h ON h.id = p.holder_id
                WHERE p.id = :id
            `;

            const rows = await this.db.query(sql, {id});

            if(!rows || rows.length == 0){
                console.log(TAG, `找不到保單編號(${id})的資料`);
                throw this.exception.BadRequest('POLICY_NOT_FOUND', 'policy not found');
            }

            return rows;
        } catch(err) {
            console.log(TAG, `取得失敗：${err}`);
            throw err;
        }
    }

    async insertPolicy(description: string, holderId: number, premium: number): Promise<number>{
        const TAG = '[寫入保單]';
        try{
            const sql = `
                INSERT INTO POLICY
                    (DESCRIPTION, HOLDER_ID, PREMIUM, CREATE_DATE)
                VALUES
                    (:description, :holder_id, :premium, SYSDATE)
                RETURN id INTO :id
            `;

            const { rowsAffected, outBinds } = await this.db.execute(sql, {
                description,
                holder_id: holderId,
                premium,
                id: {
                    dir: oracle.BIND_OUT,
                    type: oracle.NUMBER,
                },
            });

            if(rowsAffected != 1){
                console.log(TAG, `寫入新保單失敗，rowsAffected(${rowsAffected}) != 1`);
                throw this.exception.BadRequest('BAD_REQUEST', 'fail to insert new policy');
            }

            const newPolicyData = outBinds as {
                id: Array<number>,
            }

            return newPolicyData.id[0];
        } catch(err) {
            console.log(TAG, `寫入失敗：${err}`);
            throw err;
        }
    }
}

export default Policy;