import { Module } from '@nestjs/common';
import { PolicyResolver } from './policies.resolver';
import { PolicyService } from './policies.service';
import { PolicyRepository } from './policies.repository';
@Module({
    providers: [PolicyResolver, PolicyService, PolicyRepository],
})
export class PolicyModule {}
