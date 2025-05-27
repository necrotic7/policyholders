import { Injectable, OnModuleInit } from '@nestjs/common';
import { Writable } from 'stream';
import * as net from 'net';
import { ConfigService } from '@/config/config.service';

@Injectable()
export class LogstashService extends Writable implements OnModuleInit {
    private TAG = '[Logger]';
    private client: net.Socket;
    available: boolean = false;
    constructor(private configService: ConfigService) {
        super();
    }

    onModuleInit() {
        try {
            this.client = new net.Socket();
            const host = this.configService.env.logstash.host;
            const port = this.configService.env.logstash.port;

            this.client.on('error', (err) => {
                console.log(
                    this.TAG,
                    `connect to logstash fail: ${err}, skip...`,
                );
            });
            this.client.connect(port, host, () => {
                console.log(this.TAG, 'Connected to logstash');
                this.available = true;
            });
        } catch (err) {
            console.log(this.TAG, `connect to logstash fail:${err}, skip...`);
        }
    }

    _write(
        chunk: any,
        encoding: string,
        callback: (error?: Error | null) => void,
    ) {
        this.client.write(chunk, callback); // 傳給 TCP server
    }
}
