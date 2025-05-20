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
    colors: {
        critical: 'red bold',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
    },
};

class Logger {
    private instance?: winston.Logger;

    customFormat = winston.format.printf(({ level, message }) => {
        const formattedTime = moment().format('YYYY/MM/DD HH:mm:ss');
        return `[${formattedTime}][${level}] ${message}`;
    });

    init() {
        winston.addColors(customLevels.colors);
        const logger = winston.createLogger({
            levels: customLevels.levels,
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                this.customFormat,
            ),
            transports: [new winston.transports.Console()],
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
