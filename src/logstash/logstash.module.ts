import { Module } from '@nestjs/common';
import { LogstashService } from './logstash.service';
import { ConfigService } from '@/config/config.service';
import { ConfigModule } from '@/config/config.module';

@Module({
    providers: [LogstashService],
    exports: [LogstashService],
})
export class LogstashModule {}
