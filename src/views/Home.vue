<template>
  <Page>
    <ListPools
      v-if="Object.keys(subgraph.poolShares).length > 0"
      :query="queryMyLiquidity"
      title="My liquidity"
      class="mb-4"
    />
  </Page>
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
    }
  },
  beforeMount() {
    if (!this.web3.account) this.$router.push({ name: 'explore' });
  }
};
</script>
