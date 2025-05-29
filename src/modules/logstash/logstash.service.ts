import { Injectable, OnModuleInit } from '@nestjs/common';
import { Writable } from 'stream';
import * as net from 'net';
import { ConfigService } from '@/modules/config/config.service';

@Injectable()
export class LogstashService extends Writable implements OnModuleInit {
    private TAG = '[Logger]';
    private client: net.Socket;
    available: boolean = false;
    constructor(private configService: ConfigService) {
        super();
    }

    connectSocket(
        socket: net.Socket,
        host: string,
        port: number,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            socket.once('connect', () => resolve());
            socket.once('error', (err) => reject(err));
            socket.connect(port, host);
        });
    }

    async onModuleInit(): Promise<void> {
        this.client = new net.Socket();

        try {
            const host = this.configService.env.logstash.host;
            const port = this.configService.env.logstash.port;

            await this.connectSocket(this.client, host, port);

            this.available = true;
            console.log(this.TAG, '成功連線 Logstash');
        } catch (err) {
            console.log(this.TAG, `連線 Logstash 失敗：${err}`);
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
