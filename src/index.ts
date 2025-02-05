import express from 'express';
import bodyParser from 'body-parser';
import controller from './controller/index.js';
import database from './modules/database.js';
import cors from 'cors';

(async ()=>{
    // 初始化db
    await database.init();
    // 初始化 Express 應用
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    app.use(controller);

    // 啟動伺服器
    const port = 3000;
    app.listen(port, () => {
        console.log(`伺服器運行中，請訪問 http://localhost:${port}`);
    });

    // graceful shutdown
    process.on('SIGINT', async () => {
        console.log('伺服器關閉中...');
        await database.getDB.close()
        process.exit(0);
    });
})().catch((err)=>{
    console.log('伺服器初始化失敗:', err);
    process.exit(1);
});
