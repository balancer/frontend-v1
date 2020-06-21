<template>
  <nav class="nav">
    <ul class="list-style-none">
      <li v-for="(item, i) in items" :key="i">
        <router-link :to="item.to">
          {{ item.name }}
          <span
            v-if="item.count"
            v-text="$n(item.count)"
            class="counter ml-2 rounded-1"
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
    display: block;
    padding: 24px 0 0;

    .counter {
      vertical-align: middle;
      font-size: 10px;
      color: white;
      padding: 4px 6px !important;
      background-color: $blue-900 !important;
    }

    &.router-link-exact-active {
      color: $white;

      .counter {
        color: $white;
        background-color: $blue !important;
      }
    }
  }
}
</style>
