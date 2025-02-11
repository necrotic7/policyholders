import { buildSchema } from 'type-graphql';
import policyHolders from './policyHolders';

export default await buildSchema({
    resolvers: [policyHolders],
});