import 'reflect-metadata';
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType({ description: '保戶資訊' })
export class Policyholder {
    @Field(() => Int, { description: '保戶編號' })
    code!: number;

    @Field(() => String, { description: '保戶姓名' })
    name!: string;

    @Field(() => Date, { description: '註冊日期' })
    registration_date!: Date;

    @Field(() => Int, { description: '介紹人編號', nullable: true })
    introducer_code?: number;

    @Field(() => [Policyholder], { description: '左樹', nullable: true })
    l?: Policyholder[];

    @Field(() => [Policyholder], { description: '右樹', nullable: true })
    r?: Policyholder[];
}

@InputType({ description: '創建保戶表單' })
export class CreatePolicyholderInput {
    @Field(() => String, { description: '保戶姓名' })
    name!: string;

    @Field(() => Int, { description: '介紹人編號', nullable: true })
    introducer_code?: number;
}

@InputType({ description: '更新保戶表單' })
export class UpdatePolicyholderInput {
    @Field(() => Int, { description: '保戶編號' })
    code!: number;

    @Field(() => String, { description: '保戶姓名', nullable: true })
    name?: string;

    @Field(() => Int, { description: '介紹人編號', nullable: true })
    introducer_code?: number;
}
