import { Injectable, Scope } from '@nestjs/common';
import { PolicyHolderData } from './model/policyHolder.model';
import { PolicyHolderRepository as Repository } from './policyHolder.repository';

@Injectable({ scope: Scope.REQUEST })
export class PolicyHolderService {
    constructor(private readonly repository: Repository) {}

    /**
     * 執行 透過保戶編號取得保戶階層 流程
     * @param {string} code 保戶編號
     * @returns {object} args.response
     */
    async getPolicyHolderByCode(
        code: number,
    ): Promise<PolicyHolderData | object> {
        // 取得保戶及其所有下級資料
        const policyData = await this.repository.queryPolicyDataByCode(code);
        // 格式化二元樹
        const response = this.fmtPolicyHolderTree(policyData);
        return response;
    }

    /**
     * 執行 透過父級保戶編號取得保戶階層 流程
     * @param {string} code 保戶編號
     * @returns {object} response
     */
    async getPolicyHolderTopByCode(
        code: number,
    ): Promise<PolicyHolderData | object> {
        // 取得保戶上級及其所有下級資料
        const policyData =
            await this.repository.queryPolicyTopDataByChildCode(code);
        // 格式化二元樹
        const response = this.fmtPolicyHolderTree(policyData);
        return response;
    }

    /**
     * 執行 新增保戶流程
     */
    async createPolicyHolder(name: string, introducerCode?: number) {
        const parentData =
            (await this.repository.queryParentForCreate()) as PolicyHolderData;
        const newPolicyData = await this.repository.insertPolicyHolder(
            parentData?.code,
            name,
            introducerCode,
        );
        if (parentData) {
            if (!parentData.left_child_id) {
                await this.repository.updatePolicyHolder(
                    parentData.code,
                    undefined,
                    newPolicyData.code,
                    undefined,
                    undefined,
                );
            } else {
                await this.repository.updatePolicyHolder(
                    parentData.code,
                    undefined,
                    undefined,
                    newPolicyData.code,
                    undefined,
                );
            }
        }

        await this.repository.save();
        return newPolicyData;
    }

    async updatePolicyHolder(
        code: number,
        name: string | undefined,
        introducerCode: number | undefined,
    ): Promise<PolicyHolderData | object> {
        const TAG = '[更新保戶資訊]';
        if (!name && !introducerCode) {
            console.log(TAG, `錯誤：name 與 introducer_code 至少需填一個`);
            throw Error('invalid parameters');
        }
        await this.repository.updatePolicyHolder(
            code,
            name,
            undefined,
            undefined,
            introducerCode,
        );
        // 取得保戶及其所有下級資料
        const policyData = await this.repository.queryPolicyDataByCode(code);
        // 格式化二元樹
        const response = this.fmtPolicyHolderTree(policyData);
        await this.repository.save();
        return response;
    }

    /**
     * 整理保戶格式
     * @param {object} data 保戶資料
     * @param {string} data.code 保戶編號
     * @param {string} data.name 保戶姓名
     * @param {string} data.registration_date 註冊日期
     * @param {string} data.introducer_code 推薦保戶編號
     * @param {Array} data.l 左樹
     * @param {Array} data.r 右樹
     * @returns {object} 返回格式化保戶資料的物件
     */
    fmtPolicyHolderData(policyData: unknown): PolicyHolderData {
        const data = policyData as PolicyHolderData;
        return {
            code: data.code,
            name: data.name,
            registration_date: data.registration_date,
            introducer_code: data.introducer_code,
            l: data.l,
            r: data.r,
        };
    }

    /**
     * 整理保戶二元樹
     * @param {object} args
     * @param {Array} args.policyData 保戶資料集
     * @returns {object} 返回格式化保戶資料的物件
     */
    fmtPolicyHolderTree(
        data: Record<string, unknown>[],
    ): PolicyHolderData | object {
        // 快取map
        const policyMap = new Map();

        const policyData: PolicyHolderData[] = data.map((d) => {
            d.l = [];
            d.r = [];
            const fmt = d as PolicyHolderData;
            policyMap.set(fmt.code, fmt);
            return fmt;
        });
        let response: PolicyHolderData | object = {};

        policyData.forEach((d) => {
            if (d.level == 1) {
                response = this.fmtPolicyHolderData(d);
                return;
            }
            const parent = policyMap.get(d.parent_id) as PolicyHolderData;

            if (parent.left_child_id == d.code) {
                parent.l!.push(this.fmtPolicyHolderData(d));
                return;
            }
            if (parent.right_child_id == d.code) {
                parent.r!.push(this.fmtPolicyHolderData(d));
                return;
            }
        });

        return response;
    }
}
