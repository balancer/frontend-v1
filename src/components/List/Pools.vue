<template>
  <div class="border rounded-1 panel-background">
    <Filters :options="options" v-model="filters" />
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-distance="5"
      class="overflow-hidden"
    >
      <div v-if="pools.length > 0">
        <ListPool v-for="(pool, i) in pools" :key="i" :pool="pool" />
      </div>
      <ListLoadingPool v-if="loading" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const options = [
  { name: 'Pool address', class: 'column-sm text-left' },
  { name: 'Assets', class: 'flex-auto text-left' },
  { name: 'Swap fee', class: 'column' },
  { name: 'Liquidity', class: 'column' },
  { name: 'My liquidity', class: 'column' },
  { name: 'Trade vol. (24h)', class: 'column' }
];

export default {
  props: ['query'],
  data() {
    return {
      options,
      loading: false,
      page: 0,
      pools: [],
      filters: {}
    };
  },
  watch: {
    query() {
      this.page = 0;
      this.loading = true;
      this.loadMore();
    }
  },
  methods: {
    ...mapActions(['getPools']),
    async loadMore() {
      if (this.pools.length < this.page * 10) return;
      this.loading = true;
      this.page++;
      const page = this.page;
      let query = this.query || {};
      query = { ...query, page };
      const pools = await this.getPools(query);
      this.pools = this.pools.concat(pools);
      this.loading = false;
    }
  }
};
</script>
