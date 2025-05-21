import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getLogger } from '@/logger/logger.service';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private TAG = '[DB]';
    dataSource: DataSource;
    constructor(private configService: ConfigService) {}

    // 初始化連線
    async onModuleInit() {
        const logger = getLogger();
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
            logger.info(this.TAG, 'DB connected successfully!');
        } catch (error) {
            logger.error(this.TAG, 'Failed to connect to DB:', error);
            throw error;
        }
    }

    // 關閉連線
    async onModuleDestroy() {
        const logger = getLogger();
        if (this.dataSource) {
            try {
                await this.dataSource.destroy();
                logger.info(this.TAG, 'DB connection closed.');
            } catch (error) {
                logger.error(this.TAG, 'Error closing DB connection:', error);
            }
        }
    }
}
