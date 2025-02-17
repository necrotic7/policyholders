import { Repository as iRepository } from 'workspace-model/repository/policy';
import { Exception as iException } from 'workspace-model/exception';
import { PolicyData as tPolicyData } from 'workspace-model/type/policy';
class Policy {
    repository: iRepository
    exception: iException
    constructor(repository: iRepository, exception: iException){
        this.repository = repository;
        this.exception = exception;
    }

    async getPolicyByID(id: number): Promise<tPolicyData>{
        const result = await this.repository.queryPolicyByID(id);
        const policyList = result.map(r => r as tPolicyData);
        await this.repository.save();
        return policyList[0];
    }

    async createPolicy(description: string, holderId: number, premium: number): Promise<tPolicyData>{
        const newPolicyID = await this.repository.insertPolicy(description, holderId, premium);
        const result = await this.repository.queryPolicyByID(newPolicyID);
        const policyList = result.map(r => r as tPolicyData);
        await this.repository.save();
        return policyList[0];
    }
}

export default Policy;