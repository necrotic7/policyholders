import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PolicyHolderData } from './model/policyHolder.model';
import * as oracle from 'oracledb';

@Injectable()
export class PolicyHolderRepository {
    constructor(private readonly db: DatabaseService) {}

    async save() {
        await this.db.commit();
    }

    /**
     * 透過代號取得保戶資訊
     * @param {object} args
     * @param {string} args.code 保戶編號
     * @returns {object} 返回包含保戶資料的物件
     * @returns {Array} policyData - 保戶資料集
     */
    async queryPolicyDataByCode(
        code: number,
    ): Promise<Record<string, unknown>[]> {
        const TAG = '[透過保戶編號取得保戶資訊]';
        try {
            // 查詢指定保戶編號的資料與其下級
            const sql = `
                SELECT
                    LEVEL AS "level",
                    ID AS "code",
                    NAME AS "name",
                    PARENT_ID AS "parent_id",
                    LEFT_CHILD_ID AS "left_child_id",
                    RIGHT_CHILD_ID AS "right_child_id",
                    TO_CHAR(REGISTRATION_DATE, 'YYYY-MM-DD HH24:Mi:SS') AS "registration_date",
                    INTRODUCER_ID AS "introducer_code"
                FROM policyholders
                WHERE 1 = 1
                CONNECT BY parent_id = PRIOR id
                START WITH id = :code
            `;
            const params = {
                code,
            };

            const result = await this.db.query(sql, params);
            if (!result || result?.length == 0) {
                console.log(TAG, `找不到保戶編號(${code})`);
                throw Error('policy not found');
            }

            return result;
        } catch (err) {
            console.log(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }

    /**
     * 透過子代號取得父保戶資訊
     * @param {object} args
     * @param {string} args.code 保戶編號
     * @returns {object} 返回包含保戶資料的物件
     * @returns {Array} policyData - 保戶資料集
     */
    async queryPolicyTopDataByChildCode(
        code: number,
    ): Promise<Record<string, unknown>[]> {
        const TAG = '[透過子代號取得父保戶資訊]';
        try {
            // 查詢指定保戶編號的父級資料與其下級
            const sql = `
                SELECT 
                    LEVEL AS "level",
                    p.ID AS "code",
                    p.NAME AS "name",
                    p.PARENT_ID AS "parent_id",
                    p.LEFT_CHILD_ID AS "left_child_id",
                    p.RIGHT_CHILD_ID AS "right_child_id",
                    TO_CHAR(p.REGISTRATION_DATE, 'YYYY-MM-DD HH24:Mi:SS') AS "registration_date",
                    p.INTRODUCER_ID AS "introducer_code"
                FROM policyholders p
                WHERE 1 = 1
                CONNECT BY p.parent_id = PRIOR p.id
                START WITH p.id = (
                    SELECT
                        parent_id
                    FROM policyholders
                    WHERE id = :code
                )
            `;
            const params = {
                code,
            };

            const result = await this.db.query(sql, params);
            if (!result || result?.length == 0) {
                console.log(TAG, `找不到保戶編號(${code})的父級`);
                throw Error('policy parent not found');
            }

            return result;
        } catch (err) {
            console.log(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }

    /**
     * 找出新保戶的上線
     */
    async queryParentForCreate() {
        const TAG = '[找出新保戶的上線]';
        try {
            const sql = `
                SELECT
                    p.ID AS "code",
                    p.NAME AS "name",
                    p.PARENT_ID AS "parent_id",
                    p.LEFT_CHILD_ID AS "left_child_id",
                    p.RIGHT_CHILD_ID AS "right_child_id",
                    TO_CHAR(p.REGISTRATION_DATE, 'YYYY-MM-DD HH24:Mi:SS') AS "registration_date",
                    p.INTRODUCER_ID AS "introducer_code"
                FROM POLICYHOLDERS p 
                WHERE (p.LEFT_CHILD_ID IS NULL OR p.RIGHT_CHILD_ID IS NULL)
                ORDER BY id ASC, 
                -- 左子樹空白者優先
                DECODE(p.LEFT_CHILD_ID, NULL, 1, p.RIGHT_CHILD_ID, NULL, 2, 3) ASC
                FETCH FIRST ROWS ONLY
            `;

            const result = await this.db.query(sql, {});

            if (!result || result?.length != 1) {
                console.log(TAG, '找不到上線資料');
            }

            return result?.[0];
        } catch (err) {
            console.log(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }

    async insertPolicyHolder(
        parentId: number | undefined,
        name: string,
        introducerCode: number | undefined,
    ): Promise<PolicyHolderData> {
        const TAG = '[寫入新保戶資料]';
        try {
            const sql = `
                INSERT INTO POLICYHOLDERS
                    (PARENT_ID, NAME, REGISTRATION_DATE, INTRODUCER_ID)
                VALUES
                    (:parent_id, :name, SYSDATE, :introducer_id)
                RETURNING 
                    id, TO_CHAR(REGISTRATION_DATE, 'YYYY-MM-DD HH24:Mi:SS')
                INTO :id, :registration_date
            `;

            const params = {
                parent_id: parentId,
                name: name,
                introducer_id: introducerCode,
                id: {
                    dir: oracle.BIND_OUT,
                    type: oracle.NUMBER,
                },
                registration_date: {
                    dir: oracle.BIND_OUT,
                    type: oracle.STRING,
                },
            };
            const { rowsAffected, outBinds } = await this.db.execute(
                sql,
                params,
            );
            if (rowsAffected != 1) {
                console.log(
                    TAG,
                    `寫入新保戶失敗，rowsAffected(${rowsAffected}) != 1`,
                );
                throw Error('fail to insert new policy holder');
            }

            const newPolicyHolderData = outBinds as {
                id: Array<number>;
                registration_date: Array<string>;
            };

            return {
                code: newPolicyHolderData.id[0],
                name: name,
                registration_date: newPolicyHolderData.registration_date[0],
                introducer_code: introducerCode,
                parent_id: parentId,
            };
        } catch (err) {
            console.log(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }

    async updatePolicyHolder(
        code: number,
        name: string | undefined,
        leftChildId: number | undefined,
        rightChildId: number | undefined,
        introducerCode: number | undefined,
    ): Promise<void> {
        const TAG = '[更新保戶資訊]';
        try {
            const sql = `
                UPDATE POLICYHOLDERS
                SET 
                    name = NVL(:name, name),
                    left_child_id = NVL(:left_child_id, left_child_id),
                    right_child_id = NVL(:right_child_id, right_child_id),
                    introducer_id = NVL(:introducer_id, introducer_id)
                WHERE id = :code
            `;

            const { rowsAffected } = await this.db.execute(sql, {
                code,
                name,
                left_child_id: leftChildId,
                right_child_id: rightChildId,
                introducer_id: introducerCode,
            });

            if (rowsAffected != 1) {
                console.log(
                    TAG,
                    `更新保戶失敗，rowsAffected(${rowsAffected}) != 1`,
                );
                throw Error('fail to update policy holder');
            }

            return;
        } catch (err) {
            console.log(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }
}
