<template>
  <div class="px-0 px-md-5 py-4">
    <ListPools
      title="My liquidity"
      v-if="Object.keys(subgraph.poolShares).length > 0"
      :query="queryMyLiquidity"
      class="mb-4"
    />
    <ListPools
      title="Shared pools"
      :query="querySharedPools"
      :key="querySharedPools"
      class="mb-4"
    />
  </div>
</template>

<script>
export default {
  computed: {
    queryMyLiquidity() {
      const poolShares = this.subgraph.poolShares;
      const ids = Object.keys(poolShares).map(share => share.toLowerCase());
      return {
        where: {
          id_in: ids
        }
      };
    },
    querySharedPools() {
      return {
        where: {
          finalized: true
        }
      };
    }
  }
};
</script>
