import 'reflect-metadata';
import { ObjectType, InputType, Field, Int } from 'type-graphql';
@ObjectType()
class PolicyHolder {
    @Field(_type => Int)
    code!: number;
    
    @Field(_type => String)
    name!: string;

    @Field(_type => String)
    registration_date!: Date;

    @Field(_type => Int, {nullable: true})
    introducer_code?: number;

    @Field(_type => [PolicyHolder], {nullable: true})
    l?: PolicyHolder[];

    @Field(_type => [PolicyHolder], {nullable: true})
    r?: PolicyHolder[];
}

@InputType()
class CreatePolicyHolderInput implements Partial<PolicyHolder>{
    @Field(_type => String)
    name!: string;

    @Field(_type => Int, {nullable: true})
    introducer_code?: number;
}

@InputType()
class UpdatePolicyHolderInput implements Partial<PolicyHolder>{
    @Field(_type => Int)
    code!: number;

    @Field(_type => String, {nullable: true})
    name?: string;

    @Field(_type => Int, {nullable: true})
    introducer_code?: number;
}

export {
    PolicyHolder,
    CreatePolicyHolderInput,
    UpdatePolicyHolderInput,
};