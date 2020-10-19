<template>
  <Page>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h3 class="flex-auto" v-text="$t('myLiquidity')" />
    </div>
    <ListPools
      :key="JSON.stringify(queryMyLiquidity)"
      :query="queryMyLiquidity"
      class="mb-4"
    />
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h3 class="flex-auto" v-text="$t('myPools')" />
    </div>
    <ListPools :key="JSON.stringify(queryMyPools)" :query="queryMyPools" />
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
