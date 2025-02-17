import 'reflect-metadata';
import { Query, Mutation, Resolver, Arg } from 'type-graphql';
import Service from 'workspace-service/policyHolders';
import Repository from 'workspace-repository/policyHolders';
import database from 'workspace-modules/database';
import exception from 'workspace-modules/exception';
import {
    PolicyHolder as schema,
    PolicyHolderInput as Input
} from 'workspace-schema/policyHolders';
@Resolver(_of => schema)
class queryResolvers {
    @Query(_returns => schema, { nullable: true })
    async getPolicyHolder(
        @Arg("code", _type => String) code: string
    ): Promise<schema|{}>{
        const repository = new Repository(database, exception);
        const worker = new Service(repository);
        const result = await worker.getPolicyHolderByCode(code);
        return result;
    }

    @Query(_returns => schema, { nullable: true})
    async getPolicyHolderTop(
        @Arg("code", _type => String) code: string
    ): Promise<schema|{}>{
        const repository = new Repository(database, exception);
        const worker = new Service(repository);
        const result = await worker.getPolicyHolderTopByCode(code);
        return result;
    }

    @Mutation(_returns => schema, {nullable:true})
    async createPolicyHolder(
        @Arg("policyholder", _type => Input) args: Input,
    ): Promise<schema|{}>{
        const repository = new Repository(database, exception);
        const worker = new Service(repository);
        const result = await worker.createPolicyHolder(args.name, args.introducer_code);
        return result;
    }
}

export default queryResolvers;