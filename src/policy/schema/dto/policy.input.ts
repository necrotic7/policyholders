import 'reflect-metadata';
import { InputType, Field, ID, Int } from '@nestjs/graphql';

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
