export type Config = {
    port: number;
    log: {
        outLogPath: string;
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
