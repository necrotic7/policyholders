
class Policyholders {
    constructor(database, exception){
        this.db = database;
        this.exception = exception;
    }

    /**
     * 透過代號取得保戶資訊
     * @param {object} args
     * @param {string} args.code 保戶編號
     * @returns {object} 返回包含保戶資料的物件
     * @returns {Array} policyData - 保戶資料集
     */
    async queryPolicyDataByCode(args){
        const TAG = '[透過保戶編號取得保戶資訊]';
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
            `;
            const params = {
                code
            };

            const result = await this.db.execute(sql, params);
            if(!result || result?.length == 0){
                console.log(TAG, `找不到保戶編號(${code})`);
                throw this.exception.BadRequest('POLICY_NOT_FOUND', 'policy not found');
            }

            args.policyData = result;
            return args;
        } catch(err){
            console.log(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }

    /**
     * 透過子代號取得父保戶資訊
     * @param {object} args
     * @param {string} args.code 保戶編號
     * @returns {object} 返回包含保戶資料的物件
     * @returns {Array} policyData - 保戶資料集
     */
    async queryPolicyTopDataByChildCode(args){
        const TAG = '[透過子代號取得父保戶資訊]';
        try{
            const { code } = args;
            // 查詢指定保戶編號的父級資料與其下級
            const sql = `
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
                START WITH p.id = (
                    SELECT
                        parent_id
                    FROM policyholders
                    WHERE id = :code
                )
            `;
            const params = {
                code
            };

            const result = await this.db.execute(sql, params);
            if(!result || result?.length == 0){
                console.log(TAG, `找不到保戶編號(${code})的父級`);
                throw this.exception.BadRequest('POLICY_PARENT_NOT_FOUND', 'policy parent not found');
            }

            args.policyData = result;
            return args;
        } catch(err){
            console.log(TAG, `發生錯誤：${err}`);
            throw err;
        }
    }
}

module.exports = Policyholders;