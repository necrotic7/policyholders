import 'reflect-metadata';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { PolicyService as Service } from './policies.service';
import { Policy } from './types/policies.gql.type';
import { PolicyArgs } from './types/policies.gql.type';
import {
    CreatePolicyInput,
    UpdatePolicyInput,
} from './types/policies.gql.type';
@Resolver((_of) => Policy)
export class PolicyResolver {
    constructor(private readonly service: Service) {}

    @Query((_returns) => [Policy], { description: '查詢保單', nullable: true })
    async getPolicy(@Args() args: PolicyArgs): Promise<Policy[]> {
        const result = await this.service.getPolicy(
            args.policyID,
            args.policyholderCode,
        );
        return result;
    }

    @Mutation((_returns) => Policy, { description: '創建保單' })
    async createPolicy(
        @Args('args', { description: '創建保單表單' }) args: CreatePolicyInput,
    ): Promise<Policy | object> {
        const result = await this.service.createPolicy(
            args.description,
            args.holder_code,
            args.premium,
        );
        return result;
    }

    @Mutation((_returns) => Policy)
    async updatePolicy(
        @Args('args', { description: '更新保單表單' }) args: UpdatePolicyInput,
    ): Promise<Policy | object> {
        const result = await this.service.updatePolicy(
            args.id,
            args.description,
            args.premium,
        );
        return result;
    }
}
