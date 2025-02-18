import { queryPolicyArgs as iQueryPolicyArgs } from "workspace-model/repository/policy";
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

    async queryPolicy({
        policyID,
        policyHolderCode,
    }: iQueryPolicyArgs): Promise<Record<string, unknown>[]>{
        const TAG = '[透過保單編號取得保單]';
        try{
            let sql = `
                SELECT
                    p.id AS "id",
                    p.description AS "description",
                    p.holder_id AS "holder_code",
                    h.name AS "holder_name",
                    p.premium AS "premium",
                    TO_CHAR(p.create_date, 'YYYY-MM-DD HH24:Mi:SS') AS "create_date"
                FROM POLICY p
                INNER JOIN POLICYHOLDERS h ON h.id = p.holder_id
                WHERE 1=1
            `;

            const params: Record<string, any> = {};
            if(policyID){
                sql += `AND p.id = :policyID
                `;
                params.policyID = policyID;
            }

            if(policyHolderCode){
                sql += `AND h.id = :policyHolderCode
                `;
                params.policyHolderCode = policyHolderCode;
            }

            sql += `ORDER BY p.create_date DESC
            `;

            const rows = await this.db.query(sql, params);

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

    async updatePolicy(id: number, description: string|undefined, premium: number|undefined): Promise<void>{
        const TAG = '[更新保單]';
        try{
            const sql = `
                UPDATE POLICY
                SET 
                    DESCRIPTION = NVL(:description, DESCRIPTION),
                    PREMIUM = NVL(:premium, PREMIUM)
                WHERE 
                    ID = :id
            `;

            const { rowsAffected } = await this.db.execute(sql, {
                description,
                premium,
                id,
            });

            if(rowsAffected != 1){
                console.log(TAG, `更新保單失敗，rowsAffected(${rowsAffected}) != 1`);
                throw this.exception.BadRequest('BAD_REQUEST', 'fail to update policy');
            }

            return;
        } catch(err) {
            console.log(TAG, `寫入失敗：${err}`);
            throw err;
        }
    }
}

export default Policy;