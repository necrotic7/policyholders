import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PolicyModule } from './policies/policies.module';
import { PolicyHolderModule } from './policyHolders/policyHolders.moudle';
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }), // 載入 .env 設定
        DatabaseModule,
        PolicyModule,
        PolicyHolderModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
            // 禁用playground
            playground: false,
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
export class AppModule {}
