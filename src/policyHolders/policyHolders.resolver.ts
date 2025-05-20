import 'reflect-metadata';
import { Query, Mutation, Resolver, Args } from '@nestjs/graphql';
import { PolicyHolderService as Service } from './policyHolders.service';
import { PolicyHolder } from './types/policyHolders.gql.type';
import {
    CreatePolicyHolderInput,
    UpdatePolicyHolderInput,
} from './types/policyHolders.gql.type';

@Resolver((_of) => PolicyHolder)
export class PolicyHolderResolver {
    constructor(private readonly service: Service) {}

    @Query((_returns) => PolicyHolder, {
        description: '查詢保戶',
        nullable: true,
    })
    async getPolicyHolder(
        @Args('code', { description: '保戶編號' }) code: number,
    ) {
        const result = await this.service.getPolicyHolderByCode(code);
        return result;
    }

    @Query((_returns) => PolicyHolder, {
        description: '查詢保戶上級',
        nullable: true,
    })
    async getPolicyHolderTop(
        @Args('code', { description: '保戶編號' }) code: number,
    ) {
        const result = await this.service.getPolicyHolderTopByCode(code);
        return result;
    }

    @Mutation((_returns) => PolicyHolder, { description: '創建保戶' })
    async createPolicyHolder(
        @Args('policyholder', { description: '創建保戶表單' })
        args: CreatePolicyHolderInput,
    ) {
        const result = await this.service.createPolicyHolder(
            args.name,
            args.introducer_code,
        );
        return result;
    }

    @Mutation((_returns) => PolicyHolder, { description: '更新保戶' })
    async updatePolicyHolder(
        @Args('policyHolder', { description: '更新保戶表單' })
        args: UpdatePolicyHolderInput,
    ): Promise<PolicyHolder | object> {
        const result = await this.service.updatePolicyHolder(
            args.code,
            args.name,
            args.introducer_code,
        );
        return result;
    }
}
