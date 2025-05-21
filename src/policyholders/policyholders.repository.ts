import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PolicyholderData } from './types/policyholders.type';
import { PolicyholdersDB } from '@/database/schema/policyholders.schema';
import { getLogger } from '@/utils/logger';

@Injectable()
export class PolicyholdersRepository {
    constructor(private readonly db: DatabaseService) {}

    /**
     * 透過代號取得保戶資訊
     * @param {object} args
     * @param {string} args.code 保戶編號
     */
    async queryPolicyDataByCode(code: number) {
        const TAG = '[透過保戶編號取得保戶資訊]';
        const logger = getLogger();

        try {
            const db = this.db.dataSource;
            // 查詢指定保戶編號的資料與其下級
            const sql = `
                WITH RECURSIVE tree AS (
                    SELECT p.*, 1 as level
                    FROM policyholders p 
                    WHERE p.id = $1
                    UNION ALL
                    SELECT p.*, t.level + 1
                    FROM policyholders p 
                    JOIN tree t ON p.parent_id = t.id
                )
                SELECT 
                    t.id as code,
                    t.parent_id as parent_code,
                    t.left_child_id as left_child_code,
                    t.right_child_id as right_child_code,
                    t."name",
                    t.introducer_id as introducer_code,
                    t.created_at as registration_date,
                    t.updated_at,
                    t.level
                FROM tree t
            `;

            const result = (await db.query(sql, [code])) as PolicyholderData[];
            if (!result || result?.length == 0) {
                logger.error(TAG, `找不到保戶編號(${code})`);
                throw Error('policy not found');
            }

            return result;
        } catch (err) {
            logger.error(TAG, `發生錯誤：${err}`);
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
    async queryPolicyTopDataByChildCode(code: number) {
        const TAG = '[透過子代號取得父保戶資訊]';
        const logger = getLogger();
        try {
            // 查詢指定保戶編號的父級資料與其下級
            const sql = `
                WITH RECURSIVE tree AS (
                    SELECT p.*, 1 as level
                    FROM policyholders p 
                    JOIN policyholders origin ON p.id = origin.parent_id
                    WHERE origin.id = $1
                    UNION ALL
                    SELECT p.*, t.level + 1
                    FROM policyholders p 
                    JOIN tree t ON p.parent_id = t.id
                )
                SELECT 
                    t.id AS code,
                    t.parent_id AS parent_code,
                    t.left_child_id AS left_child_code,
                    t.right_child_id AS right_child_code,
                    t.name,
                    t.introducer_id AS introducer_code,
                    t.created_at AS registration_date,
                    t.updated_at,
                    t.level
                FROM tree t
            `;

            const result = (await this.db.dataSource.query(sql, [
                code,
            ])) as PolicyholderData[];
            if (!result || result?.length == 0) {
                logger.error(TAG, `找不到保戶編號(${code})的父級`);
                throw Error('policy parent not found');
            }

            return result;
        } catch (err) {
            logger.error(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }

    /**
     * 找出新保戶的上線
     */
    async queryParentForCreate() {
        const TAG = '[找出新保戶的上線]';
        const logger = getLogger();
        try {
            const sql = `
                with p as (
                    SELECT 
                        p.id AS code,
                        p.parent_id AS parent_code,
                        p.left_child_id AS left_child_code,
                        p.right_child_id AS right_child_code,
                        p.name,
                        case 
                            when p.left_child_id is null then 1
                            when p.right_child_id is null then 2
                            else 3
                        end as priority,
                        p.introducer_id AS introducer_code,
                        p.created_at AS registration_date,
                        p.updated_at
                    FROM policyholders p
                )
                select * from p
                where priority < 3
                order by code asc, priority asc
                limit 1
            `;

            const result = (await this.db.dataSource.query(
                sql,
            )) as PolicyholderData[];

            if (!result || result?.length != 1) {
                logger.error(TAG, '找不到上線資料');
            }

            return result?.[0];
        } catch (err) {
            logger.error(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }

    async insertPolicyholder(
        parentId: number,
        name: string,
        introducerId: number | undefined,
    ) {
        const TAG = '[寫入新保戶資料]';
        const logger = getLogger();
        try {
            const repo = this.db.dataSource.getRepository(PolicyholdersDB);
            const newPolicyholder = repo.create({
                name,
                parentId,
                introducerId,
            });
            return repo.save(newPolicyholder);
        } catch (err) {
            logger.error(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }

    async updatePolicyHolder(
        id: number,
        name: string | undefined,
        leftChildId: number | undefined,
        rightChildId: number | undefined,
        introducerId: number | undefined,
    ) {
        const TAG = '[更新保戶資訊]';
        const logger = getLogger();
        try {
            const repo = this.db.dataSource.getRepository(PolicyholdersDB);
            const holder = await repo.findOneBy({ id });
            if (!holder) throw Error(`cant find policyholder code ${id}`);

            if (name) holder.name = name;
            if (leftChildId) holder.leftChildId = leftChildId;
            if (rightChildId) holder.rightChildId = rightChildId;
            if (introducerId) holder.introducerId = introducerId;

            return repo.save(holder);
        } catch (err) {
            logger.error(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }
}
