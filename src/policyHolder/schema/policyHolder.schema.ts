import 'reflect-metadata';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType({description:"保戶資訊"})
export class PolicyHolder {
    @Field(() => Int, {description:"保戶編號"})
    code!: number;
    
    @Field(() => String, {description:"保戶姓名"})
    name!: string;

    @Field(() => String, {description:"註冊日期"})
    registration_date!: Date;

    @Field(() => Int, {description:"介紹人編號", nullable: true})
    introducer_code?: number;

    @Field(() => [PolicyHolder], {description:"左樹", nullable: true})
    l?: PolicyHolder[];

    @Field(() => [PolicyHolder], {description:"右樹", nullable: true})
    r?: PolicyHolder[];
}
