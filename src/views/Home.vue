<template>
  <Page>
    <Container class="mb-4">
      <div class="d-flex mb-4">
        <h1 class="flex-auto">Explore pools</h1>
        <router-link :to="{ name: 'create' }">
          <UiButton class="button-primary">
            Create a pool
          </UiButton>
        </router-link>
      </div>
    </Container>
    <Container class="d-flex sliding mb-4">
      <Filters v-model="filters" class="mr-2 flex-auto flex-lg-1" />
      <Tags class="hide-sm hide-md hide-lg flex-auto mr-2" :tag="tag" />
      <OrderBy v-model="orderBy" />
    </Container>
    <Container :slim="true">
      <div
        v-infinite-scroll="loadNextPage"
        infinite-scroll-distance="0"
        class="overflow-hidden mr-n3"
      >
        <div v-if="pools.length > 0" :key="tag">
          <BlockPool v-for="pool in pools" :key="pool.address" :pool="pool" />
        </div>
        <div v-if="loading">
          <BlockPool
            v-for="i in 3"
            :key="i"
            :class="i > 1 && 'hide-sm'"
            :loading="true"
          />
        </div>
      </div>
    </Container>
  </Page>
</template>

<script>
import { getPools } from '@/_balancer/explore';
import provider from '@/helpers/provider';
import registry from '@/_balancer/registry';

export default {
  data() {
    return {
      page: 0,
      loaded: false,
      loading: false,
      pools: [],
      orderBy: 'volume',
      filters: {}
    };
  },
  watch: {
    async tag() {
      this.page = 0;
      this.loaded = false;
      this.pools = [];
      await this.loadNextPage();
    },
    async filters() {
      this.page = 0;
      this.loaded = false;
      this.pools = [];
      await this.loadNextPage();
    },
    async orderBy() {
      this.page = 0;
      this.loaded = false;
      this.pools = [];
      await this.loadNextPage();
    }
  },
  async created() {
    await this.loadNextPage();
  },
  computed: {
    tag() {
      return this.$route.params.tag || 'all';
    },
    poolIds() {
      return this.tag === 'favorites'
        ? Object.keys(this.favorite.favorites)
        : registry.getPools({
            orderBy: this.orderBy,
            tokens: this.filters.token || [],
            tag: this.tag,
            limit: 9,
            page: this.page
          });
    }
  },
  methods: {
    async loadNextPage() {
      if (this.loaded) return;
      this.loading = true;
      this.page++;
      const poolIds = this.poolIds;
      let pools = [];
      if (poolIds.length > 0) {
        pools = Object.values(
          await getPools(this.config.chainId, provider, poolIds)
        );
      }
      if (JSON.stringify(poolIds) !== JSON.stringify(this.poolIds)) return;
      if (pools.length < 9) this.loaded = true;
      this.pools = this.pools.concat(pools);
      this.loading = false;
    }
  }
};
</script>
