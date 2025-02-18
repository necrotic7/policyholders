export interface queryPolicyArgs {
    policyID?: number|undefined
    policyHolderCode?: number|undefined
}
export interface Repository {
    queryPolicy({policyID, policyHolderCode}: queryPolicyArgs): Promise<Record<string, unknown>[]>
    insertPolicy(description: string, holderId: number, premium: number): Promise<number>
    save(): Promise<void>
};