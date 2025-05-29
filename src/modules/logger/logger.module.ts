import { Module, Global, OnModuleInit } from '@nestjs/common';
import { LoggerService } from '@/modules/logger/logger.service';
import { LogstashModule } from '@/modules/logstash/logstash.module';

@Module({
    imports: [LogstashModule],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
