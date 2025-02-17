import 'reflect-metadata';
import { Query, Mutation, Resolver, Arg, Int } from 'type-graphql';
import Service from 'workspace-service/policyHolders';
import Repository from 'workspace-repository/policyHolders';
import database from 'workspace-modules/database';
import exception from 'workspace-modules/exception';
import {
    PolicyHolder as schema,
    CreatePolicyHolderInput,
    UpdatePolicyHolderInput,
} from 'workspace-schema/policyHolders';
@Resolver(_of => schema)
class PolicyHolderResolvers {
    @Query(_returns => schema, { nullable: true })
    async getPolicyHolder(
        @Arg("code", _type => Int) code: number
    ): Promise<schema|{}>{
        const repository = new Repository(database, exception);
        const worker = new Service(repository, exception);
        const result = await worker.getPolicyHolderByCode(code);
        return result;
    }

    @Query(_returns => schema, { nullable: true})
    async getPolicyHolderTop(
        @Arg("code", _type => Int) code: number
    ): Promise<schema|{}>{
        const repository = new Repository(database, exception);
        const worker = new Service(repository, exception);
        const result = await worker.getPolicyHolderTopByCode(code);
        return result;
    }

    @Mutation(_returns => schema)
    async createPolicyHolder(
        @Arg("policyholder", _type => CreatePolicyHolderInput) args: CreatePolicyHolderInput,
    ): Promise<schema|{}>{
        const repository = new Repository(database, exception);
        const worker = new Service(repository, exception);
        const result = await worker.createPolicyHolder(args.name, args.introducer_code);
        return result;
    }

    @Mutation(_returns => schema)
    async updatePolicyHolder(
        @Arg("policyHolder", _type => UpdatePolicyHolderInput) args: UpdatePolicyHolderInput,
    ): Promise<schema|{}>{
        const repository = new Repository(database, exception);
        const worker = new Service(repository, exception);
        const result = await worker.updatePolicyHolder(args.code, args.name, args.introducer_code);
        return result;
    }
}

export default PolicyHolderResolvers;