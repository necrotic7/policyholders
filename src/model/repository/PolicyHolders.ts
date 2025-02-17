export interface Repository {
    save(): Promise<void>
    queryPolicyDataByCode(code: number): Promise<Record<string, unknown>[]>
    queryPolicyTopDataByChildCode(code: number): Promise<Record<string, unknown>[]>
    queryParentForCreate(): Promise<Record<string, unknown>>
    insertPolicyHolder(parentId:number|undefined, name:string, introducerCode:number|undefined): Promise<unknown>
    updatePolicyHolder(code: number, name: string | undefined, leftChildId: number| undefined, rightChildId: number| undefined, introducerCode: number | undefined): Promise<void>
}