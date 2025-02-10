import { gql } from 'apollo-server';
import { DocumentNode } from 'graphql';

const schema: DocumentNode = gql`
    schema {
        query: Query
    }

    type Query {
        getPolicyHolder(code: String!): PolicyHolder
        getPolicyHolderTop(code: String!): PolicyHolder
    }

    type PolicyHolder {
        code: String!
        name: String!
        registration_date: String!
        introducer_code: Int
        l: [PolicyHolder]
        r: [PolicyHolder]
    }
`;

export default schema;