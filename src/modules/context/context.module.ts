import { Module, Global } from '@nestjs/common';
import { ContextService } from '@/modules/context/context.service';

@Global()
@Module({
    providers: [ContextService],
    exports: [ContextService],
})
export class ContextModule {}
