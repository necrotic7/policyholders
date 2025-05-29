import { Module } from '@nestjs/common';
import { PolicyholderResolver } from './policyholders.resolver';
import { PolicyholderService } from './policyholders.service';
import { PolicyholdersRepository } from './policyholders.repository';
import { DatabaseModule } from '@/modules/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [
        PolicyholderResolver,
        PolicyholderService,
        PolicyholdersRepository,
    ],
})
export class PolicyholderModule {}
