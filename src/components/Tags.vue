<template>
  <div>
    <router-link
      :to="{ name: 'tag', params: { tag: i } }"
      v-for="(t, i) in tags"
      :key="i"
      class="mr-2"
    >
      <Tag :class="tag === i && 'active'">{{ t.name }}</Tag>
    </router-link>
  </div>
</template>

<script>
import registry from '@/_balancer/registry';

export default {
  props: {
    tag: String
  },
  computed: {
    tags() {
      const tags = {
        all: {
          name: 'All'
        }
      };
      if (Object.keys(this.favorite.favorites).length > 0)
        tags['favorites'] = {
          name: 'Favorites'
        };
      return { ...tags, ...registry.getTags() };
    }
  }
};
</script>
