<template>
  <Page>
    <Container class="mb-6">
      <h1 class="mb-3">Explore pools</h1>
      <div class="mb-3">
        <router-link
          :to="{ name: 'tag', params: { tag: t } }"
          v-for="(t, i) in tags"
          :key="i"
          class="mr-2"
        >
          <Tag :class="tag === t && 'active'">{{ t }}</Tag>
        </router-link>
      </div>
    </Container>
    <Container :slim="true">
      <div
        v-infinite-scroll="loadNextPage"
        infinite-scroll-distance="40"
        class="overflow-hidden mr-n3"
      >
        <div v-if="pools.length > 0" :key="tag">
          <div
            v-for="pool in pools"
            :key="pool.address"
            class="d-block float-left col-12 col-lg-4"
          >
            <BlockPool :pool="pool" class="mr-3 mb-3" />
          </div>
        </div>
        <div v-if="loading">
          <div
            v-for="i in 3"
            :key="i"
            :class="i > 1 && 'hide-sm'"
            class="d-block float-left col-12 col-lg-4"
          >
            <BlockPool :loading="true" class="mr-3 mb-3" />
          </div>
        </div>
      </div>
    </Container>
  </Page>
</template>

<script>
import { getPools } from '@/_balancer/explore';
import provider from '@/helpers/provider';

export default {
  data() {
    return {
      page: 0,
      loaded: false,
      loading: false,
      pools: []
    };
  },
  watch: {
    async tag() {
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
      return this.$route.params.tag;
    },
    tags() {
      const tags = ['all'];
      if (Object.keys(this.favorite.favorites).length > 0)
        tags.push('favorites');
      return tags.concat(Object.keys(this.ui.lists.tags));
    },
    list() {
      return this.ui.lists.tokens
        .filter(token => {
          if (this.tag === 'all') return true;
          if (
            this.tag === 'favorites' &&
            Object.keys(this.favorite.favorites).includes(token.address)
          )
            return true;
          if (token.tags.includes(this.tag)) return true;
          return false;
        })
        .map(token => token.address);
    }
  },
  methods: {
    async loadNextPage() {
      if (this.loaded) return;
      this.loading = true;
      this.page++;
      const poolIds = this.list.slice((this.page - 1) * 9, this.page * 9);
      const pools = Object.values(
        await getPools(this.config.chainId, provider, poolIds)
      );
      if (pools.length < 9) this.loaded = true;
      this.pools = this.pools.concat(pools);
      this.loading = false;
    }
  }
};
</script>
