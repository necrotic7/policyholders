import 'reflect-metadata';
import { ObjectType, Field, ID, Int, InputType } from 'type-graphql';

@ObjectType()
class Policy {
    // 保單id
    @Field(_type => ID)
    id!: number;

    // 保單描述
    @Field(_type => String)
    description!: string;

    // 保戶姓名
    @Field(_type => String)
    holder_name!: string;

    // 保戶代號
    @Field(_type => Int)
    holder_code!: number;

    // 保費
    @Field(_type => Int)
    premium!: number;

    // 創建時間
    @Field(_type => String)
    create_date!: Date;
}

@InputType()
class CreatePolicyInput implements Partial<Policy>{
    // 保單描述
    @Field(_type => String)
    description!: string;

    // 保戶代號
    @Field(_type => Int)
    holder_code!: number;

    // 保費
    @Field(_type => Int)
    premium!: number;
}

export {
    Policy,
    CreatePolicyInput,
}