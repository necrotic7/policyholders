import 'reflect-metadata';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

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

    @Field(() => String, { description: '創建時間' })
    create_date!: string;
}
