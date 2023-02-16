import {GraphQLWsLink} from "@apollo/client/link/subscriptions/index.js";
import {createClient} from "graphql-ws";
import {ApolloClient, HttpLink, InMemoryCache, split} from "@apollo/client";
import {getMainDefinition} from "@apollo/client/utilities";

const wsLink = new GraphQLWsLink(createClient({
    url: STRAWAPI_URL.replace("http","ws"),
}));

const httpLink = new HttpLink({
    uri: STRAWAPI_URL,
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

export const client = new ApolloClient({
    link:splitLink,
    cache: new InMemoryCache()
});
