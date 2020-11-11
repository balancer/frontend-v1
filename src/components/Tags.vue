<template>
  <div>
    <router-link
      :to="{ name: 'tag', params: { tag: t } }"
      v-for="(t, i) in tags"
      :key="i"
      class="mr-2"
    >
      <Tag :class="tag === t && 'active'">{{ t }}</Tag>
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
      const tags = ['all'];
      if (Object.keys(this.favorite.favorites).length > 0)
        tags.push('favorites');
      return tags.concat(registry.getTags());
    }
  }
};
</script>
