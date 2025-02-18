import 'reflect-metadata';
import { Arg, Resolver, Mutation, Query, Int } from 'type-graphql';
import Repository from 'workspace-repository/policy';
import database from 'workspace-modules/database';
import exception from 'workspace-modules/exception';
import Service from 'workspace-service/policy';
import { 
    Policy as schema,
    CreatePolicyInput,
    UpdatePolicyInput,
} from 'workspace-schema/policy';

@Resolver(_of => schema)
class PolicyResolver {
    @Query(_returns => [schema], { description:"查詢保單", nullable: true })
    async getPolicy(
        @Arg("policyID", _type => Int, {description:"保單ID", nullable: true}) policyID?: number|undefined,
        @Arg("policyHolderCode", _type => Int, {description:"保戶編號", nullable: true}) policyHolderCode?: number|undefined,
    ): Promise<schema[]|[]>{
        const repository = new Repository(database, exception);
        const worker = new Service(repository, exception);
        const result = await worker.getPolicy(policyID, policyHolderCode);
        return result;
    }

    @Mutation(_returns => schema, {description:"創建保單"})
    async createPolicy(
        @Arg("policy", _type => CreatePolicyInput, {description:"創建保單表單"}) args: CreatePolicyInput
    ): Promise<schema|{}>{
        const repository = new Repository(database, exception);
        const worker = new Service(repository, exception);
        const result = await worker.createPolicy(args.description, args.holder_code, args.premium);
        return result;
    }

    @Mutation(_returns => schema)
    async updatePolicy(
        @Arg("policy", _type => UpdatePolicyInput, {description:"更新保單表單"}) args: UpdatePolicyInput
    ): Promise<schema|{}>{
        const repository = new Repository(database, exception);
        const worker = new Service(repository, exception);
        const result = await worker.updatePolicy(args.id, args.description, args.premium);
        return result;
    }
}

export default PolicyResolver;