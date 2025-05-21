import { Injectable, OnModuleInit } from '@nestjs/common';
import { Writable } from 'stream';
import { ConfigService } from '@nestjs/config';
import * as net from 'net';

@Injectable()
export class LogstashService extends Writable implements OnModuleInit {
    private client: net.Socket;
    constructor(private configService: ConfigService) {
        super();
    }

    onModuleInit() {
        this.client = new net.Socket();
        const host =
            this.configService.get<string>('LOGSTASH_HOST') ?? 'localhost';
        const port = this.configService.get<number>('LOGSTASH_PORT') ?? 50000;
        this.client.connect(port, host, () => {
            console.log('[Logger]', 'Connected to logstash');
        });
    }

    _write(
        chunk: any,
        encoding: string,
        callback: (error?: Error | null) => void,
    ) {
        this.client.write(chunk, callback); // 傳給 TCP server
    }
}
