<template>
  <div>
    <div class="px-0 px-md-5 pt-4">
      <ListPools
        v-if="Object.keys(subgraph.poolShares).length > 0"
        :query="queryMyLiquidity"
        title="My liquidity"
        class="mb-4"
      />
    </div>
    <div class="px-0 px-md-5 pt-4">
      <ListPools
        :query="querySharedPools"
        :key="JSON.stringify(querySharedPools)"
        title="Shared pools"
        withFilters="1"
        class="mb-4"
      />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    querySharedPools() {
      return {
        where: {
          finalized: true
        }
      };
    },
    queryMyLiquidity() {
      const poolShares = this.subgraph.poolShares;
      const ids = Object.keys(poolShares).map(share => share.toLowerCase());
      return {
        where: {
          id_in: ids
        }
      };
    }
  }
};
</script>
