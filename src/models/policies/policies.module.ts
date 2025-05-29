import { Module } from '@nestjs/common';
import { PolicyResolver } from './policies.resolver';
import { PolicyService } from './policies.service';
import { PolicyRepository } from './policies.repository';
import { DatabaseModule } from '@/modules/database/database.module';
@Module({
    imports: [DatabaseModule],
    providers: [PolicyResolver, PolicyService, PolicyRepository],
})
export class PolicyModule {}
