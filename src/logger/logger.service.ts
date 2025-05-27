import * as winston from 'winston';
import moment from 'moment';
import { Injectable } from '@nestjs/common';
import { LogstashService } from '../logstash/logstash.service';
import { ConfigService } from '@/config/config.service';

let GlobalLogger: LoggerService | undefined;

export function setLoggerInstance(service: LoggerService) {
    GlobalLogger = service;
}

export function getLogger() {
    if (!GlobalLogger) throw new Error('LoggerService 尚未初始化！');
    return GlobalLogger.get();
}

@Injectable()
export class LoggerService {
    private instance?: winston.Logger;
    constructor(
        private tcpWritable: LogstashService,
        private configService: ConfigService,
    ) {}

    customLevels = {
        levels: {
            critical: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4,
        },
    };

    customFormat = winston.format.printf(({ level, message }) => {
        const formattedTime = moment().format('YYYY/MM/DD HH:mm:ss');
        return JSON.stringify({
            service: this.configService.env.service,
            version: this.configService.env.version,
            time: formattedTime,
            level,
            message,
        });
    });

    init() {
        const transports: any[] = [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: this.configService.env.log.outLogPath,
            }),
        ];
        if (this.tcpWritable.available)
            transports.push(
                new winston.transports.Stream({
                    stream: this.tcpWritable,
                }),
            );
        const logger = winston.createLogger({
            levels: this.customLevels.levels,
            format: winston.format.combine(this.customFormat),
            transports,
        });
        this.instance = logger;
        return logger;
    }

    get() {
        const baseLogger = this.instance ?? this.init();

        // 包裝: 支援 logger.info(TAG, msg)
        const wrappedLogger: any = {};
        const levels = Object.keys(this.customLevels.levels);

        levels.forEach((level) => {
            wrappedLogger[level] = (tag: string, ...msg: any[]) => {
                const fullMsg = `${tag} ${msg.join(' ')}`;
                baseLogger.log(level, fullMsg);
            };
        });

        return wrappedLogger as Record<
            keyof typeof this.customLevels.levels,
            (tag: string, ...msg: any[]) => void
        >;
    }
}
