import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() // 設定為全域模組，其他地方可以直接注入使用
@Module({
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
