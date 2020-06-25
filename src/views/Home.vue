<template>
  <div class="px-0 px-md-5 py-4">
    <div v-if="Object.keys(subgraph.poolShares).length > 0">
      <h3 class="mb-4 px-4 px-md-0">My liquidity</h3>
      <ListPools :query="queryMyLiquidity" class="mb-4" />
    </div>
    <h3 class="mb-4 px-4 px-md-0">Shared pools</h3>
    <ListPools :query="querySharedPools" class="mb-4" />
  </div>
</template>

<script>
const querySharedPools = {
  where: {
    finalized: true
  }
};

export default {
  data() {
    return {
      querySharedPools
    };
  },
  computed: {
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
