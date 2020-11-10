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
          <Tag>{{ t }}</Tag>
        </router-link>
      </div>
    </Container>
    <div v-for="(list, i) in lists" :key="i" class="mb-3">
      <Container>
        <router-link
          :to="{ name: 'tag', params: { tag: list.key } }"
          class="d-flex overflow-hidden"
        >
          <h3 v-text="list.name" class="mb-3 flex-auto" />
          <Icon name="go" class="text-white mt-n1" size="32" />
        </router-link>
      </Container>
      <Container :slim="true">
        <div class="overflow-hidden mr-n3">
          <div
            v-for="(pool, i) in list.pools"
            :key="i"
            class="d-block float-left col-12 col-lg-4"
          >
            <BlockPool
              :loading="loading"
              :pool="pools[pool]"
              class="mr-3 mb-3"
            />
          </div>
        </div>
      </Container>
    </div>
  </Page>
</template>

<script>
import { getPools } from '@/_balancer/explore';
import provider from '@/helpers/provider';

export default {
  data() {
    return {
      loaded: false,
      loading: false,
      pools: {}
    };
  },
  async created() {
    this.loading = true;
    const poolIds = Object.values(this.lists)
      .map(list => list.pools)
      .reduce((a, b) => a.concat(b));
    this.pools = await getPools(this.config.chainId, provider, poolIds);
    this.loading = false;
    this.loaded = true;
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
    lists() {
      return Object.fromEntries(
        Object.entries(this.ui.lists.tags)
          .map(tag => {
            tag[1].key = tag[0];
            tag[1].pools = this.ui.lists.tokens
              .filter(token => token.tags.includes(tag[0]))
              .map(token => token.address)
              .slice(0, 3);
            return tag;
          })
          .slice(0, 3)
      );
    }
  }
};
</script>
