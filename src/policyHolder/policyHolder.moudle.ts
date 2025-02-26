import { Module } from '@nestjs/common';
import { PolicyHolderResolver } from './policyHolder.resolver';
import { PolicyHolderService } from './policyHolder.service';
import { PolicyHolderRepository } from './policyHolder.repository';
@Module({
  providers: [PolicyHolderResolver, PolicyHolderService, PolicyHolderRepository],
})
export class PolicyHolderModule {}
