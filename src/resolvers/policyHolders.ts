import 'reflect-metadata';
import { Query, Resolver, Arg } from 'type-graphql';
import Service from 'workspace-service/PolicyHolders';
import Repository from 'workspace-repository/PolicyHolders';
import database from 'workspace-modules/database';
import exception from 'workspace-modules/exception';
import schema from 'workspace-schema/policyHolders';
@Resolver(_of => schema)
class resolvers {
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
}

export default resolvers;