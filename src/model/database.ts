export interface database {
    execute(sql: string, params:object): Promise<Record<string, unknown>[]>
}