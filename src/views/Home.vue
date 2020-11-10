<template>
  <Page>
    <Container class="mb-3">
      <h3 class="flex-auto" v-text="$t('myLiquidity')" />
    </Container>
    <Container :slim="true">
      <ListPools
        :key="JSON.stringify(queryMyLiquidity)"
        :query="queryMyLiquidity"
        class="mb-4"
      />
    </Container>
    <Container class="mb-3">
      <h3 class="flex-auto" v-text="$t('myPools')" />
    </Container>
    <Container :slim="true">
      <ListPools :key="JSON.stringify(queryMyPools)" :query="queryMyPools" />
    </Container>
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
    },
    queryMyPools() {
      return {
        where: {
          crpController: this.web3.dsProxyAddress
        }
      };
    }
  },
  beforeMount() {
    if (!this.web3.account) this.$router.push({ name: 'explore' });
  }
};
</script>
