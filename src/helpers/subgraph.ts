import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import config from '@/helpers/config';

export async function request(jsonQuery: any) {
  const query = jsonToGraphQLQuery({ query: jsonQuery });
  const res = await fetch(config.subgraphUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  const { data } = await res.json();
  return data;
}
