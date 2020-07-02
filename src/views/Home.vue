<template>
  <div class="px-0 px-md-5 py-4">
    <ListPools
      title="Shared pools"
      :query="querySharedPools"
      :key="querySharedPools"
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
