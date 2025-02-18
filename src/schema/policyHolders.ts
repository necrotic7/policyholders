import 'reflect-metadata';
import { ObjectType, InputType, Field, Int } from 'type-graphql';
@ObjectType({description:"保戶資訊"})
class PolicyHolder {
    @Field(_type => Int, {description:"保戶編號"})
    code!: number;
    
    @Field(_type => String, {description:"保戶姓名"})
    name!: string;

    @Field(_type => String, {description:"註冊日期"})
    registration_date!: Date;

    @Field(_type => Int, {description:"介紹人編號", nullable: true})
    introducer_code?: number;

    @Field(_type => [PolicyHolder], {description:"左樹", nullable: true})
    l?: PolicyHolder[];

    @Field(_type => [PolicyHolder], {description:"右樹", nullable: true})
    r?: PolicyHolder[];
}

@InputType({description:"創建保戶表單"})
class CreatePolicyHolderInput implements Partial<PolicyHolder>{
    @Field(_type => String, {description:"保戶姓名"})
    name!: string;

    @Field(_type => Int, {description:"介紹人編號", nullable: true})
    introducer_code?: number;
}

@InputType({description:"更新保戶表單"})
class UpdatePolicyHolderInput implements Partial<PolicyHolder>{
    @Field(_type => Int, {description:"保戶編號"})
    code!: number;

    @Field(_type => String, {description:"保戶姓名", nullable: true})
    name?: string;

    @Field(_type => Int, {description:"介紹人編號", nullable: true})
    introducer_code?: number;
}

export {
    PolicyHolder,
    CreatePolicyHolderInput,
    UpdatePolicyHolderInput,
};