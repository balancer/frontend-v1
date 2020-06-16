<template>
  <div>
    <Filters :isSticky="true" :options="options" v-model="filters" />
    <Container
      v-infinite-scroll="loadMore"
      infinite-scroll-distance="5"
      class="overflow-hidden"
    >
      <div v-if="pools.length > 0">
        <ListPool v-for="(pool, i) in pools" :key="i" :pool="pool" />
      </div>
      <ListPlaceholderPool v-if="loading" />
    </Container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const options = [
  { key: 'swapFee', name: 'Swap fee (%)' },
  { key: 'marketcap', name: 'Marketcap' },
  { key: 'volume1Day', name: 'Vol. 24h' }
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
  },
  mounted() {
    this.page = 0;
    this.loading = true;
    this.loadMore();
  }
};
</script>
