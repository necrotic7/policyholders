import 'reflect-metadata';
import { ObjectType, Field, Int } from 'type-graphql';
@ObjectType()
class PolicyHolder {
    @Field(_type => String)
    code!: string;
    
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

export default PolicyHolder;