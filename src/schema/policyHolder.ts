import { gql } from 'apollo-server';
import { DocumentNode } from 'graphql';

const schema: DocumentNode = gql`
    schema {
        query: Query
    }

    type Query {
        getPolicyHolder: [PolicyHolder],
    }

    type PolicyHolder {
        code: String!
        name: String!
        registration_date: Date!
        introducer_code: Int
        l: [PolicyHolder]
        r: [PolicyHolder]
    }
`;

export default schema;