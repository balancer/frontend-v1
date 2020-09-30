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
import config from '@/config';

export default {
  computed: {
    query() {
      if (config.chainId === 1)
        return {
          where: {
            id_in: Object.entries(config.crps)
              .filter(crp => crp[1].is_visible)
              .map(crp => crp[0])
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
