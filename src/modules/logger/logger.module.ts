import { Module, Global, OnModuleInit } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LogstashService } from '@/modules/logstash/logstash.service';
import { LogstashModule } from '@/modules/logstash/logstash.module';

@Module({
    imports: [LogstashModule],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
