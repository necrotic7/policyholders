import 'reflect-metadata';
import { Query, Mutation, Resolver, Args, Context } from '@nestjs/graphql';
import { PolicyholderService as Service } from '@/models/policyholders/policyholders.service';
import { Policyholder } from '@/models/policyholders/types/policyholders.gql.type';
import {
    CreatePolicyholderInput,
    UpdatePolicyholderInput,
} from '@/models/policyholders/types/policyholders.gql.type';
import { ContextService } from '@/modules/context/context.service';

@Resolver((_of) => Policyholder)
export class PolicyholderResolver {
    constructor(
        private readonly contextService: ContextService,
        private readonly service: Service,
    ) {}

    @Query((_returns) => Policyholder, {
        description: '查詢保戶',
        nullable: true,
    })
    async getPolicyholder(
        @Context() ctx: any,
        @Args('code', { description: '保戶編號' }) code: number,
    ) {
        this.contextService.setLogger(ctx.logger);
        const result = await this.service.getPolicyholderByCode(code);
        return result;
    }

    @Query((_returns) => Policyholder, {
        description: '查詢保戶上級',
        nullable: true,
    })
    async getPolicyholderTop(
        @Args('code', { description: '保戶編號' }) code: number,
    ) {
        const result = await this.service.getPolicyholderTopByCode(code);
        return result;
    }

    @Mutation((_returns) => Policyholder, { description: '創建保戶' })
    async createPolicyholder(
        @Args('policyholder', { description: '創建保戶表單' })
        args: CreatePolicyholderInput,
    ) {
        const result = await this.service.createPolicyholder(
            args.name,
            args.introducer_code,
        );
        return result;
    }

    @Mutation((_returns) => Policyholder, { description: '更新保戶' })
    async updatePolicyholder(
        @Args('policyholder', { description: '更新保戶表單' })
        args: UpdatePolicyholderInput,
    ): Promise<Policyholder | object> {
        const result = await this.service.updatePolicyholder(
            args.code,
            args.name,
            args.introducer_code,
        );
        return result;
    }
}
