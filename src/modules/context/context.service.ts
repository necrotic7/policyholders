import { Injectable, Scope } from '@nestjs/common';
import { getGeneralLogger } from '@/modules/logger/logger.service';
import { Logger } from '@/modules/logger/logger.type';

@Injectable({ scope: Scope.REQUEST }) // 👈 這是關鍵
export class ContextService {
    logger: Logger;

    setLogger(logger: Logger) {
        this.logger = logger;
        return this;
    }

    getLogger() {
        if (!this.logger) {
            this.logger = getGeneralLogger();
        }
        return this.logger;
    }
}
