import { merge, cloneDeep } from 'lodash';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import config from '@/helpers/config';
import queries from '@/helpers/queries.json';

export async function request(key: string, jsonQuery: any = {}) {
  jsonQuery = merge(cloneDeep(queries[key]), cloneDeep(jsonQuery));
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
