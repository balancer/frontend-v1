<template>
  <Page>
    <ListPools
      :query="query"
      :key="JSON.stringify(query)"
      title="Private pools"
      withFilters="1"
      class="mb-4"
    />
  </Page>
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
