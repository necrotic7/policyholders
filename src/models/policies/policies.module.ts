import { Module } from '@nestjs/common';
import { PolicyResolver } from '@/models/policies/policies.resolver';
import { PolicyService } from '@/models/policies/policies.service';
import { PolicyRepository } from '@/models/policies/policies.repository';
import { DatabaseModule } from '@/modules/database/database.module';
@Module({
    imports: [DatabaseModule],
    providers: [PolicyResolver, PolicyService, PolicyRepository],
})
export class PolicyModule {}
