import 'reflect-metadata';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType({ description: '創建保戶表單' })
export class CreatePolicyHolderInput {
    @Field(() => String, { description: '保戶姓名' })
    name!: string;

    @Field(() => Int, { description: '介紹人編號', nullable: true })
    introducer_code?: number;
}

@InputType({ description: '更新保戶表單' })
export class UpdatePolicyHolderInput {
    @Field(() => Int, { description: '保戶編號' })
    code!: number;

    @Field(() => String, { description: '保戶姓名', nullable: true })
    name?: string;

    @Field(() => Int, { description: '介紹人編號', nullable: true })
    introducer_code?: number;
}
