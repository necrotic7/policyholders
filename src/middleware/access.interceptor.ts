import { getLogger } from '@/modules/logger/logger.service';
import { EnumLoggerType, Logger } from '@/modules/logger/logger.type';
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { catchError, Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AccessInterceptor implements NestInterceptor {
    TAG = '[Access]';

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const isGraphQL = (context.getType() as string) === 'graphql';
        const uuid = uuidv4();
        const accessLogger = getLogger(EnumLoggerType.access, uuid);
        const requestLogger = getLogger(EnumLoggerType.out, uuid);

        let req, res;
        if (isGraphQL) {
            const gqlCtx = GqlExecutionContext.create(context);
            const ctx = gqlCtx.getContext();
            ctx.req.uuid = uuid;
            req = ctx.req;
            res = ctx.res;
            ctx.logger = requestLogger;
            this.gqlRequestLogging(accessLogger, req);
        } else {
            // TODO 處理http的log
            req = context.switchToHttp().getRequest();
            res = context.switchToHttp().getResponse();
        }

        return next.handle().pipe(
            tap((data) => {
                accessLogger.info(this.TAG, {
                    method: req.method,
                    url: req.originalUrl,
                    statusCode: res.statusCode,
                    data,
                });
            }),
            catchError((err) => {
                // 失敗的情況也要記 log
                accessLogger.error(this.TAG, {
                    method: req.method,
                    url: req.originalUrl,
                    statusCode: res?.statusCode,
                    error: err?.message || err,
                });
                throw err; // 錯誤要繼續往外丟，不然會被吃掉
            }),
        );
    }

    gqlRequestLogging(logger: Logger, req: any) {
        const operationName = req?.body?.operationName;
        if (operationName == 'IntrospectionQuery') return;
        const info = {
            uuid: req.uuid,
            method: req.method,
            url: req.originalUrl,
            body: req.body,
        };
        logger.info(this.TAG, info);
    }
}
