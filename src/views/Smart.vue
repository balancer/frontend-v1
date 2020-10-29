<template>
  <Page>
    <ListPools
      :query="query"
      :key="JSON.stringify(query)"
      title="Smart pools"
      withFilters="1"
    />
  </Page>
</template>

<script>
import pools from '@/_balancer/pools.json';

export default {
  computed: {
    query() {
      if (this.config.chainId === 1)
        return {
          where: {
            id_in: Object.entries(pools)
              .filter(crp => crp[1].is_compatible)
              .map(crp => crp[0].toLowerCase())
          }
        };
      return {
        where: {
          crp: true
        }
      };
    }
  }
};
</script>
