const express = require('express');
const bodyParser = require('body-parser');
const database = require('./src/modules/database');

(async ()=>{
    // 初始化db
    const db = new database();
    await db.init();
    // 初始化 Express 應用
    const app = express();
    app.use(bodyParser.json());

    // 啟動伺服器
    const port = 3000;
    app.listen(port, () => {
        console.log(`伺服器運行中，請訪問 http://localhost:${port}`);
    });
})().catch((err)=>{
    console.log(err);
    process.exit(0);
});
