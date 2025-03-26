import 'reflect-metadata';
import { Query, Mutation, Resolver, Args } from '@nestjs/graphql';
import { PolicyHolderService as Service } from './policyHolder.service';
import { PolicyHolder as schema } from './schema/policyHolder.schema';
import {
    CreatePolicyHolderInput,
    UpdatePolicyHolderInput,
} from './schema/dto/policyHolder.input';

@Resolver((_of) => schema)
export class PolicyHolderResolver {
    constructor(private readonly service: Service) {}

    @Query((_returns) => schema, { description: '查詢保戶', nullable: true })
    async getPolicyHolder(
        @Args('code', { description: '保戶編號' }) code: number,
    ): Promise<schema | object> {
        const result = await this.service.getPolicyHolderByCode(code);
        return result;
    }

    @Query((_returns) => schema, {
        description: '查詢保戶上級',
        nullable: true,
    })
    async getPolicyHolderTop(
        @Args('code', { description: '保戶編號' }) code: number,
    ): Promise<schema | object> {
        const result = await this.service.getPolicyHolderTopByCode(code);
        return result;
    }

    @Mutation((_returns) => schema, { description: '創建保戶' })
    async createPolicyHolder(
        @Args('policyholder', { description: '創建保戶表單' })
        args: CreatePolicyHolderInput,
    ): Promise<schema | object> {
        const result = await this.service.createPolicyHolder(
            args.name,
            args.introducer_code,
        );
        return result;
    }

    @Mutation((_returns) => schema, { description: '更新保戶' })
    async updatePolicyHolder(
        @Args('policyHolder', { description: '更新保戶表單' })
        args: UpdatePolicyHolderInput,
    ): Promise<schema | object> {
        const result = await this.service.updatePolicyHolder(
            args.code,
            args.name,
            args.introducer_code,
        );
        return result;
    }
}
