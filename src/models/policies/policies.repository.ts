import { DatabaseService } from '../../database/database.service';
import { Injectable } from '@nestjs/common';
import { PoliciesDB } from '@/database/schema/policies.schema';
import { PolicyData } from './types/policies.type';
import { getLogger } from '@/logger/logger.service';

@Injectable()
export class PolicyRepository {
    constructor(private readonly db: DatabaseService) {}

    async queryPolicy({
        policyID,
        policyholderCode,
    }: {
        policyID?: number | undefined;
        policyholderCode?: number | undefined;
    }) {
        const TAG = '[透過保單編號取得保單]';
        const logger = getLogger();
        try {
            const repo = this.db.dataSource
                .getRepository(PoliciesDB)
                .createQueryBuilder('p')
                .select([
                    'p.id as id',
                    'p.description as description',
                    'p.holder_id as holder_code',
                    'h.name as holder_name',
                    'p.premium as premium',
                    'p.created_at as created_at',
                ])
                .innerJoin('policyholders', 'h', 'h.id = p.holder_id')
                .where('1=1')
                .orderBy('p.id', 'DESC');

            if (policyID) repo.andWhere('p.id = :policyID', { policyID });

            if (policyholderCode)
                repo.andWhere('p.holder_id = policyholderCode', {
                    policyholderCode,
                });

            const rows = (await repo.getRawMany()) as PolicyData[];

            return rows;
        } catch (err) {
            logger.error(TAG, `取得失敗：${err}`);
            throw err;
        }
    }

    async insertPolicy(description: string, holderId: number, premium: number) {
        const TAG = '[寫入保單]';
        const logger = getLogger();
        try {
            const repo = this.db.dataSource.getRepository(PoliciesDB);
            const newPolicy = repo.create({
                description,
                holderId,
                premium,
            });

            return repo.save(newPolicy);
        } catch (err) {
            logger.error(TAG, `寫入失敗：${err}`);
            throw err;
        }
    }

    async updatePolicy(
        id: number,
        description: string | undefined,
        premium: number | undefined,
    ) {
        const TAG = '[更新保單]';
        const logger = getLogger();
        try {
            const repo = this.db.dataSource.getRepository(PoliciesDB);
            const policy = await repo.findOneBy({ id });
            if (!policy) throw Error(`cant find policy id (${id})`);

            if (description) policy.description = description;
            if (premium && !isNaN(premium)) policy.premium = premium;

            return repo.save(policy);
        } catch (err) {
            logger.error(TAG, `寫入失敗：${err}`);
            throw err;
        }
    }
}
