const database = require('../modules/database');

class Policyholders {
    constructor(){}

    async getPolicyHolderByCode(code){
        let args = {
            code
        };
        args = await this.queryPolicyDataByCode(args);
        args = this.fmtPolicyHolderByCode(args);
        return args.response;
    }

    async queryPolicyDataByCode(args){
        const TAG = '[透過代號取得保戶資訊]';
        const { code } = args;
        // 查詢指定保戶編號的資料與其下級
        const sql = `
            SELECT 
                *
            FROM policyholders
            WHERE 1 = 1
            CONNECT BY parent_id = PRIOR id
            START WITH id = :code
        `;
        const params = {
            code
        };

        const result = await database.execute(sql, params);
        if(!result || result?.length == 0){
            console.log(TAG, `找不到保戶編號(${code})`);
            throw new Error('找不到保戶');
        }

        args.policyData = result;
        return args;
    }

    fmtPolicyHolderByCode(args){
        const { policyData, code } = args;
        const root = policyData.find(d => d.ID == code);

        const response = {
            code: root.ID,
            name: root.NAME,
            registration_date: root.REGISTRATION_DATE,
            introducer_code: root.INTRODUCER_CODE,
            l:[],
            r:[],
        };

        policyData.map(d => {
            const left = d.LEFT_CHILD_ID;
            const right = d.RIGHT_CHILD_ID;
            if(left){
                const leftData = policyData.find(d => d.ID == left);
                response.l.push({
                    code: leftData.ID,
                    name: leftData.NAME,
                    registration_date: leftData.REGISTRATION_DATE,
                    introducer_code: leftData.INTRODUCER_CODE,
                });
            }
            if(right){
                const rightData = policyData.find(d => d.ID == right);
                response.r.push({
                    code: rightData.ID,
                    name: rightData.NAME,
                    registration_date: rightData.REGISTRATION_DATE,
                    introducer_code: rightData.INTRODUCER_CODE,
                });
            }
        });

        args.response = response;
        return args;
    }
}

module.exports = Policyholders;