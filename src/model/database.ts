import oracle from 'oracledb';
export interface database {
    query(sql: string, params: oracle.BindParameters): Promise<Record<string, unknown>[]>
    execute(sql: string, params: oracle.BindParameters): Promise<oracle.Result<unknown>>
    commit(): Promise<void>
}