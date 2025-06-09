import { PolicyRepository as Repository } from '@/models/policies/policies.repository';
import { PolicyData } from '@/models/policies/types/policies.type';
import { Injectable, Scope } from '@nestjs/common';

// 讓 Service 變成 Request Scoped，每個請求都會有新的 instance
@Injectable({ scope: Scope.REQUEST })
export class PolicyService {
    constructor(private readonly repository: Repository) {}

    async getPolicy(
        policyID: number | undefined,
        policyholderCode: number | undefined,
    ): Promise<PolicyData[]> {
        const result = await this.repository.queryPolicy({
            policyID,
            policyholderCode: policyholderCode,
        });
        return result;
    }

    async createPolicy(
        description: string,
        holderId: number,
        premium: number,
    ): Promise<PolicyData> {
        try {
            // 初始化連線
            await this.repository.base.getTransaction();
            const newPolicy = await this.repository.insertPolicy(
                description,
                holderId,
                premium,
            );
            await this.repository.base.commit();

            const result = await this.repository.queryPolicy({
                policyID: newPolicy.id,
            });
            return result[0];
        } catch (err) {
            await this.repository.base.rollback();
            throw err;
        }
    }

    async updatePolicy(
        id: number,
        description: string | undefined,
        premium: number | undefined,
    ) {
        try {
            // 初始化連線
            await this.repository.base.getTransaction();
            await this.repository.updatePolicy(id, description, premium);
            await this.repository.base.commit();

            const result = await this.repository.queryPolicy({ policyID: id });
            return result[0];
        } catch (err) {
            await this.repository.base.rollback();
            throw err;
        }
    }
}
