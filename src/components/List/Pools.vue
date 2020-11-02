<template>
  <div>
    <Container v-if="title" class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h3 class="flex-auto" v-text="title" />
    </Container>
    <UiTable>
      <UiTableTh>
        <div v-text="$t('assets')" class="flex-auto text-left" />
        <div v-text="$t('swapFee')" class="column hide-sm hide-md" />
        <div v-text="$t('marketCap')" class="column" />
        <div v-text="$t('volume24')" class="column hide-sm hide-md hide-lg" />
      </UiTableTh>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-distance="10"
        class="overflow-hidden"
      >
        <div v-if="pools.length > 0">
          <ListPool v-for="(pool, i) in pools" :key="i" :pool="pool" />
        </div>
        <UiTableTr v-else-if="!loading">
          <div v-text="$t('emptyState')" />
        </UiTableTr>
        <ListLoading
          v-if="loading"
          :classes="[
            'flex-auto text-left',
            'column hide-sm hide-md',
            'column',
            'column hide-sm hide-md hide-lg'
          ]"
          :height="29"
        />
      </div>
    </UiTable>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { formatFilters, ITEMS_PER_PAGE } from '@/helpers/utils';

export default {
  props: ['query', 'title', 'withFilters'],
  data() {
    return {
      loading: false,
      page: 0,
      pools: [],
      filters: formatFilters(this.$route.query)
    };
  },
  watch: {
    query() {
      this.page = 0;
      this.loading = true;
      this.loadMore();
    },
    filters() {
      if (!this.withFilters) return;
      this.page = 0;
      this.loading = true;
      this.pools = [];
      let query = formatFilters(this.filters);
      if (query.token && query.token.length === 0) query = {};
      query.filter = 1;
      this.$router.push({ query });
      this.loadMore();
    }
  },
  methods: {
    ...mapActions(['getPools']),
    async loadMore() {
      if (this.pools.length < this.page * ITEMS_PER_PAGE) return;
      this.loading = true;
      this.page++;
      const page = this.page;
      let query = this.query || {};
      if (this.withFilters) {
        const filters = formatFilters(this.filters);
        if (filters.token && filters.token.length > 0) {
          query.where.tokensList_contains = filters.token;
        }
      }
      query = { ...query, page };
      const pools = await this.getPools(query);
      this.pools = this.pools.concat(pools);
      this.loading = false;
    }
  }
};
</script>
