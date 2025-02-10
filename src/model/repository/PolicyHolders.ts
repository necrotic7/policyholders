export interface Repository {
    queryPolicyDataByCode(code: string): Promise<Record<string, unknown>[]>
    queryPolicyTopDataByChildCode(code: string): Promise<Record<string, unknown>[]>
}