import PolicyholdersService from 'workspace-service/PolicyHolders';
import PolicyholdersRepository from 'workspace-repository/PolicyHolders';
import database from 'workspace-modules/database';
import { Exception as exception } from 'workspace-modules/exception';

const resolvers = {
    Query:{
        getPolicyHolder: async function(parent:void, args: {code: string}){
            const repository = new PolicyholdersRepository(database, exception);
            const worker = new PolicyholdersService(repository);
            const result = await worker.getPolicyHolderByCode(args.code);
            return result;
        }
    }
};

export default resolvers;