import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Config } from './config.type';
import pkg from '@/../package.json';

@Injectable()
export class ConfigService implements OnModuleInit {
    env: Config;
    constructor(private nestConfig: NestConfigService) {}

    onModuleInit() {
        this.env = {
            service: pkg.name,
            port: this.nestConfig.get<number>('API_PORT') ?? 3000,
            version: pkg.version,
            db: {
                username: this.nestConfig.get<string>('DB_USERNAME')!,
                password: this.nestConfig.get<string>('DB_PASSWORD')!,
                host: this.nestConfig.get<string>('DB_HOST')!,
                port: this.nestConfig.get<number>('DB_PORT')!,
                name: this.nestConfig.get<string>('DB_NAME')!,
            },
            log: {
                outLogPath:
                    this.nestConfig.get<string>('OUTLOG_PATH') ?? 'log/app.log',
            },
            logstash: {
                host:
                    this.nestConfig.get<string>('LOGSTASH_HOST') ?? 'localhost',
                port: this.nestConfig.get<number>('LOGSTASH_PORT') ?? 50000,
            },
        };
        return;
    }
}
