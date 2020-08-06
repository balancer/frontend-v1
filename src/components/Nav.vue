<template>
  <nav class="nav">
    <ul class="list-style-none">
      <li v-for="(item, i) in items" :key="i">
        <router-link :to="item.to">
          <span>{{ item.name }}</span>
          <UiCounter
            v-if="item.count > 0"
            v-text="_num(item.count)"
            class="ml-2"
          />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ['items']
};
</script>

<style scoped lang="scss">
@import '../vars';

.nav {
  ul > li > a {
    font-size: 16px;
    color: $white;
    display: block;
    padding: 24px 0 0;
  }
}
</style>
