import { GraphQLClient } from "graphql-request";

const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT;

export const graphqlClient = new GraphQLClient(endpoint);

export async function gqlRequest<TData, TVariables extends object = object>(
    query: string,
    variables?: TVariables
): Promise<TData> {
    if (variables) {
        return graphqlClient.request<TData>(query, variables);
    }
    return graphqlClient.request<TData>(query);
}
