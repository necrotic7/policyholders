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

    async getPolicy(policyID: number|undefined, policyHolderCode: number|undefined): Promise<tPolicyData[]>{
        const result = await this.repository.queryPolicy({ policyID, policyHolderCode });
        const policyList = result.map(r => r as tPolicyData);
        return policyList;
    }

    async createPolicy(description: string, holderId: number, premium: number): Promise<tPolicyData>{
        const newPolicyID = await this.repository.insertPolicy(description, holderId, premium);
        const result = await this.repository.queryPolicy({ policyID: newPolicyID });
        const policyList = result.map(r => r as tPolicyData);
        await this.repository.save();
        return policyList[0];
    }

    async updatePolicy(id: number, description: string|undefined, premium: number|undefined){
        await this.repository.updatePolicy(id, description, premium);
        const result = await this.repository.queryPolicy({ policyID: id });
        const policyList = result.map(r => r as tPolicyData);
        await this.repository.save();
        return policyList[0];
    }
}

export default Policy;