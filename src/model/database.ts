import oracle from 'oracledb';
export interface database {
    execute(sql: string, params: oracle.BindParameters): Promise<Record<string, unknown>[]>
}