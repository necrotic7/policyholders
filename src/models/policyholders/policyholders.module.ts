import { Module } from '@nestjs/common';
import { PolicyholderResolver } from './policyholders.resolver';
import { PolicyholderService } from './policyholders.service';
import { PolicyholdersRepository } from './policyholders.repository';
@Module({
    providers: [
        PolicyholderResolver,
        PolicyholderService,
        PolicyholdersRepository,
    ],
})
export class PolicyholderModule {}
