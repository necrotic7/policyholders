import * as winston from 'winston';
import moment from 'moment';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { LogstashService } from '../logstash/logstash.service';
import { ConfigService } from '@/modules/config/config.service';
import { EnumLoggerLevel, EnumLoggerType, Logger } from './logger.type';
import * as _ from 'lodash';

let GlobalLogger: LoggerService;

export function getGeneralLogger() {
    return GlobalLogger.get(EnumLoggerType.out);
}

export function getLogger(type: EnumLoggerType, uuid?: string) {
    return GlobalLogger.get(type, uuid);
}

@Injectable()
export class LoggerService implements OnModuleInit {
    outLogInstance: winston.Logger;
    accessLogInstance: winston.Logger;
    constructor(
        private tcpWritable: LogstashService,
        private configService: ConfigService,
    ) {}

    customFormat = winston.format.printf(
        ({ level, message, uuid, ...meta }) => {
            const formattedTime = moment().format('YYYY/MM/DD HH:mm:ss');
            return JSON.stringify({
                service: this.configService.env.service,
                version: this.configService.env.version,
                time: formattedTime,
                level,
                uuid,
                message,
                ...meta, // 把其他 meta fields 展開進來
            });
        },
    );

    onModuleInit() {
        const outLogger = this.initLogger(
            this.configService.env.log.outLogPath,
        );
        this.outLogInstance = outLogger;
        const accessLogger = this.initLogger(
            this.configService.env.log.accessLogPath,
        );
        this.accessLogInstance = accessLogger;
        GlobalLogger = this;
        return;
    }

    initLogger(path: string) {
        const transports: any[] = [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: path,
            }),
        ];
        if (this.tcpWritable.available)
            transports.push(
                new winston.transports.Stream({
                    stream: this.tcpWritable,
                }),
            );
        const logger = winston.createLogger({
            levels: Object(EnumLoggerLevel),
            format: winston.format.combine(this.customFormat),
            transports,
        });
        return logger;
    }

    getInstanceByType(type: EnumLoggerType) {
        switch (type) {
            case EnumLoggerType.access:
                return this.accessLogInstance;
            case EnumLoggerType.out:
            default:
                return this.outLogInstance;
        }
    }

    get(type: EnumLoggerType, uuid?: string) {
        const instance = this.getInstanceByType(type);
        const baseLogger = instance.child({ uuid });
        // 包裝: 支援 logger.info(TAG, msg)
        const wrappedLogger: any = {};
        const levels = Object.keys(EnumLoggerLevel);

        levels.forEach((level) => {
            wrappedLogger[level] = (tag: string, msg: any) => {
                const isObj = _.isObject(msg);
                if (isObj) {
                    baseLogger.log(level, tag, msg);
                } else {
                    baseLogger.log(level, `${tag} ${msg}`); // msg 是字串就直接印
                }
            };
        });

        return wrappedLogger as Logger;
    }
}
