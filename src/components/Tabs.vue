<template>
  <Nav :items="items" id="tabs" />
</template>

<script>
export default {
  props: ['pool'],
  computed: {
    items() {
      const items = [
        {
          name: 'Balances',
          to: { name: 'pool' },
          count: this.pool.tokens.length
        }
      ];
      if (this.pool.swapsCount > 0) {
        items.push({
          name: 'Swaps',
          to: { name: 'pool-swaps' },
          count: this.pool.swapsCount
        });
      }
      const myPoolArr = this.subgraph.myPools.map(myPool => myPool.id);
      if (this.pool.finalized) {
        items.push({
          name: 'Holders',
          to: { name: 'pool-shares' },
          count: this.pool.holdersCount
        });
      }
      items.push({
        name: 'About',
        to: { name: 'pool-about' }
      });
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

      a {
        line-height: 44px;
        height: 44px;
        overflow: hidden;
        padding: 0 16px;
        border-radius: $border-radius $border-radius 0 0;

        &.router-link-exact-active {
          background-color: $blue-900;
        }
      }
    }
  }
}
</style>
