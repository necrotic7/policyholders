import { Module } from '@nestjs/common';
import { LogstashService } from '@/modules/logstash/logstash.service';

@Module({
    providers: [LogstashService],
    exports: [LogstashService],
})
export class LogstashModule {}
