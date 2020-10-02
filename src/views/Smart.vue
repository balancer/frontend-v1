<template>
  <div>
    <div class="px-0 px-md-5 pt-4">
      <ListPools
        :query="query"
        :key="JSON.stringify(query)"
        title="Smart pools"
        withFilters="1"
        class="mb-4"
      />
    </div>
  </div>
</template>

<script>
import pools from '@/helpers/pools';

export default {
  computed: {
    query() {
      if (this.config.chainId === 1)
        return {
          where: {
            id_in: Object.entries(pools)
              .filter(crp => crp[1].is_compatible)
              .map(crp => crp[0].toLowerCase())
          }
        };
      return {
        where: {
          crp: true
        }
      };
    }
  }
};
</script>
