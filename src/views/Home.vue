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
      <div class="d-flex sliding">
        <Tags :tag="tag" />
      </div>
    </Container>
    <Container class="d-flex sliding mb-4">
      <Filters
        v-model="tokens"
        :value="tokens"
        class="mr-2 flex-auto flex-lg-1"
      />
      <OrderBy v-model="orderBy" />
    </Container>
    <Container :slim="true">
      <div
        v-infinite-scroll="loadNextPage"
        infinite-scroll-distance="0"
        class="overflow-hidden"
      >
        <div v-if="pools.length > 0" :key="tag">
          <PoolList
            v-for="pool in pools"
            :key="pool.address"
            :pool="pool"
            view="list"
          />
        </div>
        <div v-if="loading">
          <PoolList
            v-for="i in 3"
            :key="i"
            :class="i > 1 && 'hide-sm'"
            :loading="true"
            view="list"
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

const DEFAULT_ORDER_BY = 'liquidity';

export default {
  data() {
    return {
      page: 0,
      loaded: false,
      loading: false,
      pools: [],
      orderBy: DEFAULT_ORDER_BY,
      tokens: this.$route.query.token
        ? Array.isArray(this.$route.query.token)
          ? this.$route.query.token
          : [this.$route.query.token]
        : []
    };
  },
  watch: {
    async tag() {
      this.page = 0;
      this.loaded = false;
      this.pools = [];
      await this.loadNextPage();
    },
    async tokens() {
      this.page = 0;
      this.loaded = false;
      this.pools = [];
      this.updateRoute();
      await this.loadNextPage();
    },
    async orderBy() {
      this.page = 0;
      this.loaded = false;
      this.pools = [];
      this.updateRoute();
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
    filters() {
      return {
        orderBy: this.orderBy,
        tokens: this.tokens || [],
        tag: this.tag
      };
    },
    poolIds() {
      return this.tag === 'favorites'
        ? Object.keys(this.favorite.favorites)
        : registry.getPools({
            ...this.filters,
            limit: 9,
            page: this.page
          });
    }
  },
  methods: {
    async loadNextPage() {
      if (this.loading && this.page !== 0) return;
      const filters = this.filters;
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
      if (JSON.stringify(filters) !== JSON.stringify(this.filters)) return;
      if (pools.length < 9) this.loaded = true;
      this.pools = this.pools.concat(pools);
      this.loading = false;
    },
    updateRoute() {
      this.$router.push({
        query: {
          orderBy: this.orderBy === DEFAULT_ORDER_BY ? undefined : this.orderBy,
          token: this.tokens
        }
      });
    }
  }
};
</script>
