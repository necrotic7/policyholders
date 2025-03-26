import { Module } from '@nestjs/common';
import { PolicyResolver } from './policy.resolver';
import { PolicyService } from './policy.service';
import { PolicyRepository } from './policy.repository';
@Module({
    providers: [PolicyResolver, PolicyService, PolicyRepository],
})
export class PolicyModule {}
