import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import queries from '@/helpers/queries.json';
import { setGoal } from '@/helpers/fathom';
import config from '@/config';

export async function request(key: string | null, jsonQuery: any = {}) {
  jsonQuery = key
    ? merge(cloneDeep(queries[key]), cloneDeep(jsonQuery))
    : jsonQuery;
  const query =
    typeof jsonQuery === 'string'
      ? jsonQuery
      : jsonToGraphQLQuery({ query: jsonQuery });
  const res = await fetch(config.subgraphUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  try {
    const { data } = await res.json();
    return data;
  } catch (e) {
    setGoal('TPVLQU4A');
    return Promise.reject(e);
  }
}
