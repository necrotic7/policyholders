import * as winston from 'winston';
import * as moment from 'moment';

let GlobalLogger: Logger | undefined;

export function getLogger() {
    if (!GlobalLogger) GlobalLogger = new Logger();
    return GlobalLogger.get();
}

const customLevels = {
    levels: {
        critical: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
    },
};

export class Logger {
    private instance?: winston.Logger;

    customFormat = winston.format.printf(({ level, message }) => {
        const formattedTime = moment().format('YYYY/MM/DD HH:mm:ss');
        return `[${formattedTime}][${level}] ${message}`;
    });

    init() {
        const logger = winston.createLogger({
            levels: customLevels.levels,
            format: winston.format.combine(
                this.customFormat,
                winston.format.json(),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'log/app.log' }),
            ],
        });
        this.instance = logger;
        return logger;
    }

    get() {
        const baseLogger = this.instance ?? this.init();

        // 包裝: 支援 logger.info(TAG, msg)
        const wrappedLogger: any = {};
        const levels = Object.keys(customLevels.levels);

        levels.forEach((level) => {
            wrappedLogger[level] = (tag: string, ...msg: any[]) => {
                const fullMsg = `${tag} ${msg.join(' ')}`;
                baseLogger.log(level, fullMsg);
            };
        });

        return wrappedLogger as Record<
            keyof typeof customLevels.levels,
            (tag: string, ...msg: any[]) => void
        >;
    }
}
