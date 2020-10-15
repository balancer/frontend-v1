<template>
  <Page>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h3 class="flex-auto" v-text="$t('myPools')" />
    </div>
    <ListPools :key="JSON.stringify(query)" :query="query" />
  </Page>
</template>

<script>
export default {
  computed: {
    query() {
      return {
        where: {
          crpController: this.web3.dsProxyAddress
        }
      };
    }
  }
};
</script>
