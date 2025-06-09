import { Injectable, Scope } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { DatabaseService } from './database.service';

@Injectable({ scope: Scope.REQUEST })
export class RepositoryBase {
    tx: QueryRunner | undefined;
    constructor(readonly db: DatabaseService) {}

    async getTransaction() {
        return this.tx ?? (await this.initTransaction());
    }

    async initTransaction() {
        const qr = await this.db.getTx();
        this.tx = qr;
        return qr;
    }

    setTransaction(tx: QueryRunner) {
        this.tx = tx;
    }

    getRepo(repo: any) {
        if (this.tx) {
            return this.tx.manager.getRepository(repo);
        }
        return this.db.dataSource.getRepository(repo);
    }

    async query(sql: string, params?: any[]) {
        return this.db.dataSource.query(sql, params, this.tx);
    }

    async commit() {
        if (this.tx) {
            await this.tx.commitTransaction();
            this.tx = undefined;
        }
        return;
    }

    async rollback() {
        if (this.tx) {
            await this.tx.rollbackTransaction();
            this.tx = undefined;
        }
        return;
    }
}
