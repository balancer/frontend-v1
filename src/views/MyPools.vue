<template>
  <div class="px-0 px-md-5 py-4">
    <h3 class="mb-4 px-4 px-md-0">My pools</h3>
    <ListPools :key="JSON.stringify(query)" :query="query" class="mb-4" />
  </div>
</template>

<script>
export default {
  computed: {
    query() {
      return {
        where: {
          crpController: this.web3.account
        }
      };
    }
  }
};
</script>
