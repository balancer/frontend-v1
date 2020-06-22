<template>
  <div>
    <div v-if="Object.keys(subgraph.poolShares).length > 0">
      <h3 class="mb-4">My liquidity</h3>
      <ListPools :query="queryMyLiquidity" class="mb-4" />
    </div>
    <h3 class="mb-4">Shared pools</h3>
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
