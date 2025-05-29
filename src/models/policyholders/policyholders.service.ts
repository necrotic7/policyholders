import { Injectable, Scope } from '@nestjs/common';
import { PolicyholderData } from './types/policyholders.type';
import { PolicyholdersRepository as Repository } from './policyholders.repository';
import { Policyholder } from './types/policyholders.gql.type';
import { getGeneralLogger } from '@/modules/logger/logger.service';
import { BaseService } from '@/base/base.service';
import { ContextService } from '@/modules/context/context.service';

@Injectable({ scope: Scope.REQUEST })
export class PolicyholderService {
    constructor(
        private readonly contextService: ContextService,
        private readonly repository: Repository,
    ) {}

    /**
     * 執行 透過保戶編號取得保戶階層 流程
     * @param {string} code 保戶編號
     * @returns {object} args.response
     */
    async getPolicyholderByCode(
        code: number,
    ): Promise<PolicyholderData | object> {
        // 取得保戶及其所有下級資料
        const policyData = await this.repository.queryPolicyDataByCode(code);
        // 格式化二元樹
        const response = this.fmtPolicyholderTree(policyData);
        return response;
    }

    /**
     * 執行 透過父級保戶編號取得保戶階層 流程
     * @param {string} code 保戶編號
     * @returns {object} response
     */
    async getPolicyholderTopByCode(
        code: number,
    ): Promise<PolicyholderData | object> {
        // 取得保戶上級及其所有下級資料
        const policyData =
            await this.repository.queryPolicyTopDataByChildCode(code);
        // 格式化二元樹
        const response = this.fmtPolicyholderTree(policyData);
        return response;
    }

    /**
     * 執行 新增保戶流程
     */
    async createPolicyholder(name: string, introducerCode?: number) {
        const parentData =
            (await this.repository.queryParentForCreate()) as PolicyholderData;
        const newPolicyData = await this.repository.insertPolicyholder(
            parentData?.code ?? 0,
            name,
            introducerCode,
        );
        if (parentData) {
            if (!parentData.left_child_code) {
                await this.repository.updatePolicyHolder(
                    parentData.code,
                    undefined,
                    newPolicyData.id,
                    undefined,
                    undefined,
                );
            } else {
                await this.repository.updatePolicyHolder(
                    parentData.code,
                    undefined,
                    undefined,
                    newPolicyData.id,
                    undefined,
                );
            }
        }

        return this.getPolicyholderByCode(newPolicyData.id);
    }

    async updatePolicyholder(
        code: number,
        name: string | undefined,
        introducerCode: number | undefined,
    ) {
        const TAG = '[更新保戶資訊]';
        const logger = getGeneralLogger();
        if (!name && !introducerCode) {
            logger.error(TAG, `錯誤：name 與 introducer_code 至少需填一個`);
            throw Error('invalid parameters');
        }
        await this.repository.updatePolicyHolder(
            code,
            name,
            undefined,
            undefined,
            introducerCode,
        );

        return this.getPolicyholderByCode(code);
    }

    /**
     * 整理保戶二元樹
     * @param {object} args
     * @param {Array} args.policyData 保戶資料集
     * @returns {object} 返回格式化保戶資料的物件
     */
    fmtPolicyholderTree(data: PolicyholderData[]): Policyholder {
        data.map((d) => {
            d.l = [];
            d.r = [];

            const parent = data.find((p) => p.code == d.parent_code);
            if (!parent) return;

            if (parent.left_child_code == d.code) {
                parent.l?.push(d);
                return;
            }
            if (parent.right_child_code == d.code) {
                parent.r?.push(d);
                return;
            }
        });

        const root = data.find((d) => d.level == 1);
        if (!root) throw Error('fail to find policyholder root');

        return root;
    }
}
