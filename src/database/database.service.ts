import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    dataSource: DataSource;
    constructor(private configService: ConfigService) {}

    // 初始化連線
    async onModuleInit() {
        try {
            const AppDataSource = new DataSource({
                type: 'postgres',
                host: this.configService.get<string>('DB_HOST'),
                port: this.configService.get<number>('DB_PORT'),
                username: this.configService.get<string>('DB_USERNAME'),
                password: this.configService.get<string>('DB_PASSWORD'),
                database: this.configService.get<string>('DB_NAME'),
                logging: false,
                entities: [
                    __dirname + '/schema/*.ts',
                    __dirname + '/schema/*.js',
                ],
            });
            this.dataSource = await AppDataSource.initialize();
            console.log('DB connected successfully!');
        } catch (error) {
            console.error('Failed to connect to DB:', error);
            throw error;
        }
    }

    // 關閉連線
    async onModuleDestroy() {
        if (this.dataSource) {
            try {
                await this.dataSource.destroy();
                console.log('DB connection closed.');
            } catch (error) {
                console.error('Error closing DB connection:', error);
            }
        }
    }
}
