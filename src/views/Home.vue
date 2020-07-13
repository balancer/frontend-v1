<template>
  <div class="px-0 px-md-5 py-4">
    <ListPools
      title="Shared Pools"
      :query="querySharedPools"
      :key="JSON.stringify(querySharedPools)"
      class="mb-4"
    />
  </div>
</template>

<script>
export default {
  computed: {
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
