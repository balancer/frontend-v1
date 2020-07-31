<template>
  <Container slim="1">
    <ListPools
      title="My liquidity"
      v-if="Object.keys(subgraph.poolShares).length > 0"
      :query="queryMyLiquidity"
      class="mb-4"
    />
  </Container>
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
  mounted() {
    if (!this.web3.account) this.$router.push({ name: 'explore' });
  }
};
</script>
