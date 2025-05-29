import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@/modules/config/config.service';

@Global() // 註冊為全域模組，優先執行
@Module({
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}
