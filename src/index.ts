import database from 'workspace-modules/database';
import { ApolloServer } from '@apollo/server';
import typeDefs from 'workspace-schema/policyHolders';
import resolvers from 'workspace-resolvers/policyHolders';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { koaMiddleware } from '@as-integrations/koa';

(async ()=>{
    // 初始化db
    await database.init();
    
    // 啟動apollo-server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();
    
    // 初始化Koa
    const app = new Koa();
    app.use(bodyParser());
    app.use(koaMiddleware(server));

    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
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
