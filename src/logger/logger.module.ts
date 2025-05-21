import { Module, Global, OnModuleInit } from '@nestjs/common';
import { LoggerService, setLoggerInstance } from './logger.service';
import { LogstashService } from '@/logstash/logstash.service';

@Global() // 設定為全域模組，其他地方可以直接注入使用
@Module({
    providers: [LoggerService, LogstashService],
    exports: [LoggerService],
})
export class LoggerModule implements OnModuleInit {
    constructor(private readonly loggerService: LoggerService) {}

    onModuleInit() {
        setLoggerInstance(this.loggerService);
    }
}
