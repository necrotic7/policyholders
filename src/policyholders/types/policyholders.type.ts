export type PolicyholderData = {
    code: number;
    name: string;
    registration_date: Date;
    updated_at?: Date;
    introducer_code?: number;
    level?: number;
    parent_code?: number;
    l?: PolicyholderData[];
    r?: PolicyholderData[];
    left_child_code?: number;
    right_child_code?: number;
};
