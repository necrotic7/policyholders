export interface queryPolicyArgs {
    policyID?: number|undefined
    policyHolderCode?: number|undefined
}
export interface Repository {
    save(): Promise<void>
    queryPolicy({policyID, policyHolderCode}: queryPolicyArgs): Promise<Record<string, unknown>[]>
    insertPolicy(description: string, holderId: number, premium: number): Promise<number>
    updatePolicy(id: number, description: string|undefined, premium: number|undefined): Promise<void>
};