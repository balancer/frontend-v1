<template>
  <div>
    <div class="px-0 px-md-5 pt-4">
      <ListPools
        :query="query"
        :key="JSON.stringify(query)"
        title="Private pools"
        withFilters="1"
        class="mb-4"
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
          finalized: false
        }
      };
    }
  }
};
</script>
