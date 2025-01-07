const database = require('../modules/database');
const exception = require('../modules/exception');

class Policyholders {
    constructor(){}

    async getPolicyHolderByCode(code){
        let args = {
            code
        };
        args = await this.queryPolicyDataByCode(args);
        args = this.fmtPolicyHolderTree(args);
        return args.response;
    }

    async queryPolicyDataByCode(args){
        const TAG = '[透過代號取得保戶資訊]';
        try{
            const { code } = args;
            // 查詢指定保戶編號的資料與其下級
            const sql = `
                SELECT
                    LEVEL AS "level",
                    ID AS "code",
                    NAME AS "name",
                    PARENT_ID AS "parent_id",
                    LEFT_CHILD_ID AS "left_child_id",
                    RIGHT_CHILD_ID AS "right_child_id",
                    TO_CHAR(REGISTRATION_DATE, 'YYYY-MM-DD HH24:Mi:SS') AS "registration_date",
                    INTRODUCER_ID AS "introducer_code"
                FROM policyholders
                WHERE 1 = 1
                CONNECT BY parent_id = PRIOR id
                START WITH id = :code
                ORDER BY LEVEL ASC
            `;
            const params = {
                code
            };

            const result = await database.execute(sql, params);
            if(!result || result?.length == 0){
                console.log(TAG, `找不到保戶編號(${code})`);
                throw exception.BadRequest('POLICY_NOT_FOUND', 'policy not found');
            }

            args.policyData = result;
            return args;
        } catch(err){
            console.log(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }

    async getPolicyHolderTopByCode(code){
        let args = {
            code
        };
        args = await this.queryPolicyTopDataByChildCode(args);
        args = this.fmtPolicyHolderTree(args);
        return args.response;
    }

    async queryPolicyTopDataByChildCode(args){
        const TAG = '[透過子代號取得父保戶資訊]';
        try{
            const { code } = args;
            // 查詢指定保戶編號的父級資料與其下級
            const sql = `
                WITH top AS (
                    SELECT
                        parent_id
                    FROM policyholders
                    WHERE id = :code
                )
                SELECT 
                    LEVEL AS "level",
                    p.ID AS "code",
                    p.NAME AS "name",
                    p.PARENT_ID AS "parent_id",
                    p.LEFT_CHILD_ID AS "left_child_id",
                    p.RIGHT_CHILD_ID AS "right_child_id",
                    TO_CHAR(p.REGISTRATION_DATE, 'YYYY-MM-DD HH24:Mi:SS') AS "registration_date",
                    p.INTRODUCER_ID AS "introducer_code"
                FROM policyholders p
                WHERE 1 = 1
                CONNECT BY p.parent_id = PRIOR p.id
                START WITH p.id = (SELECT parent_id FROM top)
                ORDER BY LEVEL ASC
            `;
            const params = {
                code
            };

            const result = await database.execute(sql, params);
            if(!result || result?.length == 0){
                console.log(TAG, `找不到保戶編號(${code})的父級`);
                throw exception.BadRequest('POLICY_PARENT_NOT_FOUND', 'policy parent not found');
            }

            args.policyData = result;
            return args;
        } catch(err){
            console.log(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }

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

    fmtPolicyHolderTree(args){
        const { policyData } = args;
        policyData.map(d => {
            d.l = [];
            d.r = [];
        });
        let response = {};

        policyData.map(d => {
            if(d.level == 1){
                response = this.fmtPolicyHolderData(d);
                return;
            }
            const parent = policyData.find(p => p.code == d.parent_id);

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

module.exports = Policyholders;