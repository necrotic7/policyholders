import { buildSchema } from 'type-graphql';
import policyHolders from './policyHolders';
import policy from './policy';

export default await buildSchema({
    resolvers: [policyHolders, policy],
});