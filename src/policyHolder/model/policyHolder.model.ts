export type PolicyHolderData = {
    code: number
    name: string
    registration_date: string
    introducer_code?: number
    level?: number
    parent_id?: number
    l?: PolicyHolderData[]
    r?: PolicyHolderData[]
    left_child_id?: number
    right_child_id?: number
};