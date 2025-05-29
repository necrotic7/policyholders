export type Config = {
    service: string;
    port: number;
    version: string;
    log: {
        outLogPath: string;
        accessLogPath: string;
    };
    db: {
        username: string;
        password: string;
        host: string;
        port: number;
        name: string;
    };
    logstash: {
        host: string;
        port: number;
    };
};
