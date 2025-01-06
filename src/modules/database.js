const mysql = require('mysql2/promise');

class Database {
    constructor(){}

    get getDB(){
        return this.db;
    }

    async init(){
        try{
            // MySQL 資料庫連線設定
            const db = await mysql.createConnection({
                host: '10.1.103.111',
                user: 'root',
                password: 'safesync',
                database: 'cash'
            });

            // 連接資料庫
            await db.connect();

            this.db = db;
        } catch(err){
            console.log('mysql 連線失敗，原因：', err);
            throw err;
        }
    }
}

module.exports = Database;