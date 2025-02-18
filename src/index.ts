import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { koaMiddleware } from '@as-integrations/koa';
import schema from 'workspace-resolvers/index';
import database from 'workspace-modules/database';

(async ()=>{
    // 初始化db
    await database.init();

    const loggingPlugin: ApolloServerPlugin = {
        async requestDidStart(requestContext) {
            const query = requestContext.request.query;

            // 過濾掉 introspection query (__schema 查詢)
            if (query && query.includes("__schema")) {
                return {};
            }
            console.log(`📌 GraphQL Request: ${query}`);
            console.log(`📦 Variables:`, JSON.stringify(requestContext.request.variables));
            
            return {
                async willSendResponse(responseContext) {
                    console.log(`✅ GraphQL Response:`, JSON.stringify(responseContext.response.body));
                }
            };
        }
    };
    
    // 啟動apollo-server
    const server = new ApolloServer({
        schema,
        plugins: [loggingPlugin],
    });
    await server.start();
    
    // 初始化Koa
    const app = new Koa();
    app.use(bodyParser());
    app.use(cors());
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
