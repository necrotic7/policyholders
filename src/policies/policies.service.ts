import { PolicyRepository as Repository } from './policies.repository';
import { PolicyData } from './types/policies.type';
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
        const newPolicy = await this.repository.insertPolicy(
            description,
            holderId,
            premium,
        );
        const result = await this.repository.queryPolicy({
            policyID: newPolicy.id,
        });
        return result[0];
    }

    async updatePolicy(
        id: number,
        description: string | undefined,
        premium: number | undefined,
    ) {
        await this.repository.updatePolicy(id, description, premium);
        const result = await this.repository.queryPolicy({ policyID: id });
        return result[0];
    }
}
