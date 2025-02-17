export interface Repository {
    queryPolicyByID(code: number): Promise<Record<string, unknown>[]>
    insertPolicy(description: string, holderId: number, premium: number): Promise<number>
    save(): Promise<void>
};