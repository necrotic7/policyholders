import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private connection: oracledb.Connection;

    constructor(private configService: ConfigService) {}

    // 初始化連線
    async onModuleInit() {
        try {
        this.connection = await oracledb.getConnection({
            user: this.configService.get<string>('ORACLE_USER'),
            password: this.configService.get<string>('ORACLE_PASSWORD'),
            connectString: this.configService.get<string>('ORACLE_CONNECT_STRING'),
        });
        console.log('Oracle DB connected successfully!');
        } catch (error) {
        console.error('Failed to connect to Oracle DB:', error);
        throw error;
        }
    }

    // 釋放連線
    async onModuleDestroy() {
        if (this.connection) {
        try {
            await this.connection.close();
            console.log('Oracle DB connection closed.');
        } catch (error) {
            console.error('Error closing Oracle DB connection:', error);
        }
        }
    }

    // 執行查詢
    async executeQuery(sql: string, params: oracledb.BindParameters = {}) {
        if (!this.connection) throw new Error('No Oracle DB connection.');

        const result = await this.connection.execute(sql, params, {
        outFormat: oracledb.OUT_FORMAT_OBJECT, // 回傳物件格式
        });
        return result.rows;
    }

    async query(sql: string, params: oracledb.BindParameters){
        const db = this.connection;
        const result = await db.execute(sql, params);
        // 轉換 rows 為物件陣列
        const rows = result.rows ?? [];
        const metaData = result.metaData ?? [];

        const transformedRows = rows.map(row => {
            const r = row as unknown[]
            const obj: Record<string, unknown> = {};
            metaData.forEach((meta, index) => {
                obj[meta.name] = r[index];
            });
            return obj;
        });

        return transformedRows;
    }

    async execute(sql: string, params: oracledb.BindParameters){
        const db = this.connection;
        const result = await db.execute(sql, params);
        return result;
    }

    async commit(){
        await this.connection.commit();
    }
}