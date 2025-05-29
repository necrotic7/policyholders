import 'reflect-metadata';
import { Args, Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { PolicyService as Service } from '@/models/policies/policies.service';
import { Policy } from '@/models/policies/types/policies.gql.type';
import { PolicyArgs } from '@/models/policies/types/policies.gql.type';
import {
    CreatePolicyInput,
    UpdatePolicyInput,
} from '@/models/policies/types/policies.gql.type';
import { ContextService } from '@/modules/context/context.service';
@Resolver((_of) => Policy)
export class PolicyResolver {
    constructor(
        private readonly contextService: ContextService,
        private readonly service: Service,
    ) {}

    @Query((_returns) => [Policy], { description: '查詢保單', nullable: true })
    async getPolicy(
        @Context() ctx: any,
        @Args() args: PolicyArgs,
    ): Promise<Policy[]> {
        this.contextService.setLogger(ctx.logger);
        const result = await this.service.getPolicy(
            args.policyID,
            args.policyholderCode,
        );
        return result;
    }

    @Mutation((_returns) => Policy, { description: '創建保單' })
    async createPolicy(
        @Context() ctx: any,
        @Args('args', { description: '創建保單表單' }) args: CreatePolicyInput,
    ): Promise<Policy | object> {
        this.contextService.setLogger(ctx.logger);
        const result = await this.service.createPolicy(
            args.description,
            args.holder_code,
            args.premium,
        );
        return result;
    }

    @Mutation((_returns) => Policy)
    async updatePolicy(
        @Context() ctx: any,
        @Args('args', { description: '更新保單表單' }) args: UpdatePolicyInput,
    ): Promise<Policy | object> {
        this.contextService.setLogger(ctx.logger);
        const result = await this.service.updatePolicy(
            args.id,
            args.description,
            args.premium,
        );
        return result;
    }
}
