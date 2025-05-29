import { Module } from '@nestjs/common';
import { PolicyholderResolver } from '@/models/policyholders/policyholders.resolver';
import { PolicyholderService } from '@/models/policyholders/policyholders.service';
import { PolicyholdersRepository } from '@/models/policyholders/policyholders.repository';
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
