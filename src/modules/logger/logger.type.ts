export type Logger = Record<
    keyof typeof EnumLoggerLevel,
    (tag: string, ...msg: any[]) => void
>;

export enum EnumLoggerType {
    out,
    access,
}

export enum EnumLoggerLevel {
    critical = 0,
    error = 1,
    warn = 2,
    info = 3,
    debug = 4,
}
