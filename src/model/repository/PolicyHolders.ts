export type Repository = {
    save(): Promise<void>
    queryPolicyDataByCode(code: string): Promise<Record<string, unknown>[]>
    queryPolicyTopDataByChildCode(code: string): Promise<Record<string, unknown>[]>
    queryParentForCreate(): Promise<Record<string, unknown>>
    insertPolicyHolder(parentId:number|undefined, name:string, introducerCode:number|undefined): Promise<unknown>
    updatePolicyHolder(code: number, name: string, leftChildId?: number, rightChildId?: number): Promise<void>
}