import {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { DataProvider } from "react-admin";
import { createClient } from "graphql-ws";

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  })
);

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  // uri: "http://localhost:4000/graphql", // only needed when using query and mutation
  link: splitLink,
  cache: new InMemoryCache(),
});

export const dataProvider = {
  getList: async (resource, _params) => {
    const response = await client.query({
      query: gql`
        query {
          ${resource} {
            id
            name
            organizations {
              id
              name
            }
          }
        }
      `,
    });

    return {
      data: response.data[resource],
      total: response.data[resource].length,
    };
  },
} as DataProvider;
