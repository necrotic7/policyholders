import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DatabaseModule } from '@/modules/database/database.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { PolicyModule } from '@/models/policies/policies.module';
import { PolicyholderModule } from '@/models/policyholders/policyholders.module';
import { LoggerModule } from '@/modules/logger/logger.module';
import { LogstashModule } from '@/modules/logstash/logstash.module';
import { ConfigModule } from '@/modules/config/config.module';
import { ContextModule } from '@/modules/context/context.module';
@Module({
    imports: [
        NestConfigModule.forRoot({ isGlobal: true }), // 載入 .env 設定
        ConfigModule,
        ContextModule,
        LogstashModule,
        LoggerModule,
        DatabaseModule,
        PolicyModule,
        PolicyholderModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
            // 禁用playground
            playground: false,
            context: ({ req, res }) => ({ req, res }),
            // 啟用sandbox
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            buildSchemaOptions: {
                directives: [
                    new GraphQLDirective({
                        name: 'upper',
                        locations: [DirectiveLocation.FIELD_DEFINITION],
                    }),
                ],
            },
        }),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // 可以在apply中註冊middleware
        consumer.apply().forRoutes('*');
    }
}
