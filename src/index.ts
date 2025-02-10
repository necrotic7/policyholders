import database from 'workspace-modules/database';
import { ApolloServer } from "apollo-server";

(async ()=>{
    // 初始化db
    await database.init();
    
    // 啟動apollo-server
    const server: ApolloServer = new ApolloServer({
    });

    const serverInfo = await server.listen();
    console.log('server info:', JSON.stringify(serverInfo));

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
