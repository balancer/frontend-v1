<template>
  <div>
    <div class="px-0 px-md-5">
      <ListPools
        :key="JSON.stringify(query)"
        :query="query"
        title="My pools"
        class="pt-4"
      />
    </div>
  </div>
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
