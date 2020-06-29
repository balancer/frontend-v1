<template>
  <Nav :items="items" id="tabs" />
</template>

<script>
import { clone } from '@/helpers/utils';

const startItems = [
  {
    name: 'Balances',
    to: { name: 'pool' }
  },
  {
    name: 'Swaps',
    to: { name: 'pool-swaps' }
  },
  {
    name: 'Holders',
    to: { name: 'pool-shares' }
  }
];

export default {
  props: ['pool'],
  computed: {
    items() {
      const items = clone(startItems);
      items[0].count = this.pool.tokens.length;
      items[1].count = this.pool.swapsCount;
      const myPoolArr = this.subgraph.myPools.map(myPool => myPool.id);
      if (myPoolArr.includes(this.pool.id)) {
        items.push({
          name: 'Settings',
          to: { name: 'pool-settings' }
        });
      }
      return items;
    }
  }
};
</script>

<style lang="scss">
@import '../vars';

#tabs {
  ul {
    line-height: 0;

    li {
      display: inline-block;
      font-size: 16px;

      a {
        line-height: 40px;
        height: 42px;
        overflow: hidden;
        padding: 0 14px;
        border-radius: $border-radius $border-radius 0 0;

        &.router-link-exact-active {
          background-color: $blue-900;
        }
      }
    }
  }
}
</style>
