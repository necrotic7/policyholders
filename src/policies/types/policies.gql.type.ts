import {
    ObjectType,
    Field,
    ID,
    Int,
    InputType,
    ArgsType,
} from '@nestjs/graphql';

@ObjectType({ description: '保單資訊' })
export class Policy {
    @Field(() => ID, { description: '保單id' })
    id!: number;

    @Field(() => String, { description: '保單描述' })
    description!: string;

    @Field(() => String, { description: '保戶姓名' })
    holder_name!: string;

    @Field(() => Int, { description: '保戶代號' })
    holder_code!: number;

    @Field(() => Int, { description: '保費' })
    premium!: number;

    @Field(() => Date, { description: '創建時間' })
    created_at!: Date;
}

@InputType({ description: '創建保單表單' })
export class CreatePolicyInput {
    @Field(() => String, { description: '保單描述' })
    description!: string;

    @Field(() => Int, { description: '保戶代號' })
    holder_code!: number;

    @Field(() => Int, { description: '保費' })
    premium!: number;
}

@InputType({ description: '更新保單表單' })
export class UpdatePolicyInput {
    @Field(() => ID, { description: '保單id' })
    id!: number;

    @Field(() => String, { description: '保單描述', nullable: true })
    description?: string;

    @Field(() => Int, { description: '保費', nullable: true })
    premium?: number;
}

@ArgsType()
export class PolicyArgs {
    @Field(() => Int, { description: '保單ID', nullable: true })
    policyID?: number;

    @Field(() => Int, { description: '保戶編號', nullable: true })
    policyholderCode?: number;
}
