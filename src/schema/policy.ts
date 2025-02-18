import 'reflect-metadata';
import { ObjectType, Field, ID, Int, InputType } from 'type-graphql';

@ObjectType({description:"保單資訊"})
class Policy {
    @Field(_type => ID, {description:"保單id"})
    id!: number;

    @Field(_type => String, {description:"保單描述"})
    description!: string;

    @Field(_type => String, {description:"保戶姓名"})
    holder_name!: string;

    @Field(_type => Int, {description:"保戶代號"})
    holder_code!: number;

    @Field(_type => Int, {description:"保費"})
    premium!: number;

    @Field(_type => String, {description:"創建時間"})
    create_date!: string;
}

@InputType({description:"創建保單表單"})
class CreatePolicyInput implements Partial<Policy>{
    @Field(_type => String, {description:"保單描述"})
    description!: string;

    @Field(_type => Int, {description:"保戶代號"})
    holder_code!: number;

    @Field(_type => Int, {description:"保費"})
    premium!: number;
}

@InputType({description:"更新保單表單"})
class UpdatePolicyInput implements Partial<Policy>{
    @Field(_type => ID, {description:"保單id"})
    id!: number;

    @Field(_type => String, {description:"保單描述", nullable: true})
    description?: string;

    @Field(_type => Int, {description:"保費", nullable: true})
    premium?: number;
}

export {
    Policy,
    CreatePolicyInput,
    UpdatePolicyInput,
}