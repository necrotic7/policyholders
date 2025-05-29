import { Module } from '@nestjs/common';
import { LogstashService } from './logstash.service';

@Module({
    providers: [LogstashService],
    exports: [LogstashService],
})
export class LogstashModule {}
