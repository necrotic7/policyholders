import oracle from 'oracledb';
const { getConnection } = oracle;
class Database {
    db: oracle.Connection | null
    constructor() {
        this.db = null; // 儲存資料庫連線
    }

    get getDB(): oracle.Connection {
        if (!this.db) {
            throw new Error('Database not initialized. Call init() first.');
        }
        return this.db;
    }

    async init(): Promise<oracle.Connection> {
        if (this.db) {
            console.log('Database already initialized.');
            return this.db;
        }
        try {

            this.db = await getConnection({
                user: 'ars', // Oracle 資料庫使用者名稱
                password: 'ars#KniLrATs946#168', // 密碼
                connectString: '10.1.103.110:1521/DEV'
            });
            console.log('db connection established.');
            return this.db;
        } catch (err) {
            console.error('db connection failed:', err);
            throw err;
        }
    }

    async execute(sql: string, params: oracle.BindParameters){
        const db = this.getDB;
        const result = await db.execute(sql, params);
        // 轉換 rows 為物件陣列
        const rows = result.rows ?? [];
        const metaData = result.metaData ?? [];

        const transformedRows = rows.map(row => {
            const r = row as unknown[]
            const obj: Record<string, unknown> = {};
            metaData.forEach((meta, index) => {
                obj[meta.name] = r[index];
            });
            return obj;
        });

        return transformedRows;
    }
}

// 單例模式：導出一個初始化後的實體
const instance = new Database();
export default instance;
