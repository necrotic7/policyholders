import 'reflect-metadata';
import { Arg, Resolver, Mutation } from 'type-graphql';
import Repository from 'workspace-repository/policy';
import database from 'workspace-modules/database';
import exception from 'workspace-modules/exception';
import Service from 'workspace-service/policy';
import { 
    Policy as schema,
    CreatePolicyInput, 
} from 'workspace-schema/policy';

@Resolver(_of => schema)
class PolicyResolver {
    @Mutation(_returns => schema)
    async createPolicy(
        @Arg("policy", _type => CreatePolicyInput) args: CreatePolicyInput
    ): Promise<schema|{}>{
        const repository = new Repository(database, exception);
        const worker = new Service(repository, exception);
        const result = await worker.createPolicy(args.description, args.holder_code, args.premium);
        return result;
    }
}

export default PolicyResolver;