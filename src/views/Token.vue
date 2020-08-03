<template>
  <div class="px-0 px-md-5 py-4">
    <h3 class="mb-4 px-4 px-md-0">
      Token {{ _shorten(id) }}
      <a :href="_etherscanLink(id)" target="_blank" class="text-white">
        <Icon name="external-link" size="16" class="ml-1" />
      </a>
    </h3>
    <ListPools :query="query" class="mb-4" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      query: {
        where: {
          tokensList_contains: [this.$route.params.id]
        }
      }
    };
  }
};
</script>
