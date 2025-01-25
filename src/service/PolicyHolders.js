
class Policyholders {
    constructor(repository){
        this.repository = repository;
    }

    /**
     * 執行 透過保戶編號取得保戶階層 流程
     * @param {string} code 保戶編號
     * @returns {object} args.response
     */
    async getPolicyHolderByCode(code){
        let args = {
            code
        };
        // 取得保戶及其所有下級資料
        args = await this.repository.queryPolicyDataByCode(args);
        // 格式化二元樹
        args = this.fmtPolicyHolderTree(args);
        return args.response;
    }

    /**
     * 執行 透過父級保戶編號取得保戶階層 流程
     * @param {string} code 保戶編號
     * @returns {object} response
     */
    async getPolicyHolderTopByCode(code){
        let args = {
            code
        };
        // 取得保戶上級及其所有下級資料
        args = await this.repository.queryPolicyTopDataByChildCode(args);
        // 格式化二元樹
        args = this.fmtPolicyHolderTree(args);
        return args.response;
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
    fmtPolicyHolderData(data){
        return {
            code: data.code,
            name: data.name,
            registration_date: data.registration_date,
            introducer_code: data.introducer_code,
            l:data.l,
            r:data.r,
        };
    }

    /**
     * 整理保戶二元樹
     * @param {object} args
     * @param {Array} args.policyData 保戶資料集
     * @returns {object} 返回格式化保戶資料的物件
     */
    fmtPolicyHolderTree(args){
        const { policyData } = args;
        // 快取map
        const policyMap = new Map();

        policyData.forEach(d => {
            d.l = [];
            d.r = [];
            policyMap.set(d.code, d)
        });
        let response = {};

        policyData.forEach(d => {
            if(d.level == 1){
                response = this.fmtPolicyHolderData(d);
                return;
            }
            const parent = policyMap.get(d.parent_id);

            if(parent.left_child_id == d.code){
                parent.l.push(this.fmtPolicyHolderData(d));
                return;
            }
            if(parent.right_child_id == d.code){
                parent.r.push(this.fmtPolicyHolderData(d));
                return;
            }
        });

        args.response = response;
        return args;
    }
}

export default Policyholders;