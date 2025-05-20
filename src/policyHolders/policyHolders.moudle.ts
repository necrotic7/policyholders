import { Module } from '@nestjs/common';
import { PolicyHolderResolver } from './policyHolders.resolver';
import { PolicyHolderService } from './policyHolders.service';
import { PolicyHoldersRepository } from './policyHolders.repository';
@Module({
    providers: [
        PolicyHolderResolver,
        PolicyHolderService,
        PolicyHoldersRepository,
    ],
})
export class PolicyHolderModule {}
