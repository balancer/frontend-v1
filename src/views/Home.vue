<template>
  <div>
    <div class="px-0 px-md-5 pt-4">
      <ListPools
        title="My liquidity"
        v-if="Object.keys(subgraph.poolShares).length > 0"
        :query="queryMyLiquidity"
        class="mb-4"
      />
    </div>
    <div class="px-0 px-md-5 pb-4">
      <ListPools
        title="Shared pools"
        :query="querySharedPools"
        :key="JSON.stringify(querySharedPools)"
        class="mb-4"
      />
    </div>
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
