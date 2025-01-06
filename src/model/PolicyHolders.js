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
        try{
            const { code } = args;
            // 查詢指定保戶編號的資料與其下級
            const sql = `
            SELECT 
                ID AS "code",
                NAME AS "name",
                LEFT_CHILD_ID AS "left_child_id",
                RIGHT_CHILD_ID AS "right_child_id",
                TO_CHAR(REGISTRATION_DATE, 'YYYY-MM-DD HH24:Mi:SS') AS "registration_date",
                INTRODUCER_ID AS "introducer_code"
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
        } catch(err){
            console.log(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }

    fmtPolicyHolderByCode(args){
        const { policyData, code } = args;
        const root = policyData.find(d => d.code == code);

        const response = {
            code: root.code,
            name: root.name,
            registration_date: root.registration_date,
            introducer_code: root.introducer_code,
            l:[],
            r:[],
        };

        policyData.map(d => {
            const left = d.left_child_id;
            const right = d.right_child_id;
            if(left){
                const leftData = policyData.find(d => d.code == left);
                response.l.push({
                    code: leftData.code,
                    name: leftData.name,
                    registration_date: leftData.registration_date,
                    introducer_code: leftData.introducer_code,
                });
            }
            if(right){
                const rightData = policyData.find(d => d.code == right);
                response.r.push({
                    code: rightData.code,
                    name: rightData.name,
                    registration_date: rightData.registration_date,
                    introducer_code: rightData.introducer_code,
                });
            }
        });

        args.response = response;
        return args;
    }
}

module.exports = Policyholders;