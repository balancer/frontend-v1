<template>
  <div>
    <Filters v-model="filters" />
    <div
      v-infinite-scroll="() => (page += 1)"
      infinite-scroll-distance="10"
      class="overflow-hidden container-lg p-responsive"
    >
      <Pool v-for="pool in poolsWithFilters" :key="pool.id" :pool="pool" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['pools'],
  data() {
    return {
      filters: {
        query: '',
        orderBy: 'marketcap',
        orderDirection: 'desc'
      },
      page: 1
    };
  },
  computed: {
    poolsWithFilters() {
      return this.pools
        .filter(pool => {
          const tokensStr = pool.tokens
            .map(token => `${token.symbol} ${token.address}`)
            .join(' ')
            .toLowerCase();
          return tokensStr.includes(this.filters.query.toLowerCase());
        })
        .slice(0, this.page * 20)
        .sort((a, b) => {
          return this.filters.orderDirection === 'desc'
            ? b[this.filters.orderBy] - a[this.filters.orderBy]
            : a[this.filters.orderBy] - b[this.filters.orderBy];
        });
    }
  },
  methods: {
    loadMore() {
      this.page += 1;
    }
  }
};
</script>
