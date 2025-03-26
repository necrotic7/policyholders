import { IsOptional, Min } from 'class-validator';
import 'reflect-metadata';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PolicyArgs {
    @Field(() => Int, { description: '保單ID', nullable: true })
    @Min(1)
    @IsOptional()
    policyID?: number;

    @Field(() => Int, { description: '保戶編號', nullable: true })
    @Min(1)
    @IsOptional()
    policyholderCode?: number;
}
