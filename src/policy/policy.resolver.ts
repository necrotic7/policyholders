import 'reflect-metadata';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { IsOptional, IsInt, Min, ValidateNested } from 'class-validator';
import { PolicyService as Service } from './policy.service'
import { Policy as schema } from './schema/policy.schema';
import { PolicyArgs } from './schema/dto/policy.args';
import { 
    CreatePolicyInput,
    UpdatePolicyInput,
} from './schema/dto/policy.input';
@Resolver(_of => schema)
export class PolicyResolver {
    constructor(private readonly service: Service) {}
    
    @Query(_returns => [schema], { description:"查詢保單", nullable: true })
    async getPolicy(
        @Args() args: PolicyArgs,
    ): Promise<schema[]>{
        const result = await this.service.getPolicy(args.policyID, args.policyholderCode);
        return result;
    }

    @Mutation(_returns => schema, {description:"創建保單"})
    async createPolicy(
        @Args('args', { description:"創建保單表單"}) args: CreatePolicyInput
    ): Promise<schema|{}>{
        const result = await this.service.createPolicy(args.description, args.holder_code, args.premium);
        return result;
    }

    @Mutation(_returns => schema)
    async updatePolicy(
        @Args('args', { description:"更新保單表單"}) args: UpdatePolicyInput
    ): Promise<schema|{}>{
        const result = await this.service.updatePolicy(args.id, args.description, args.premium);
        return result;
    }
}