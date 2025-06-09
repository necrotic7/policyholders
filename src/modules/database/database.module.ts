import { Module } from '@nestjs/common';
import { DatabaseService } from '@/modules/database/database.service';
import { RepositoryBase } from './repository.base';

@Module({
    providers: [DatabaseService, RepositoryBase],
    exports: [DatabaseService, RepositoryBase],
})
export class DatabaseModule {}
