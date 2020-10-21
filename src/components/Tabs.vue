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
          name: this.$t('balances'),
          to: { name: 'pool' },
          count: this.pool.tokens.length
        }
      ];
      if (this.pool.swapsCount > 0) {
        items.push({
          name: this.$t('swaps'),
          to: { name: 'pool-swaps' },
          count: this.pool.swapsCount
        });
      }
      if (this.pool.finalized) {
        items.push({
          name: this.$t('holders'),
          to: { name: 'pool-shares' },
          count: this.pool.holdersCount
        });
      }
      items.push({
        name: this.$t('about'),
        to: { name: 'pool-about' }
      });
      if (
        this.web3.account &&
        this.web3.dsProxyAddress &&
        this.pool.crpController &&
        this.web3.dsProxyAddress.toLowerCase() ===
          this.pool.crpController.toLowerCase()
      ) {
        items.push({
          name: this.$t('settings'),
          to: { name: 'pool-settings' }
        });
      }

      // Show Actions if the person is logged in
      // AND (the pool can change weights (so potentially provide pokeWeights to anyone)
      //      OR this user is the controller, and it has one of the rights with associated actions)
      if (
        this.web3.account &&
        this.pool.rights.canChangeWeights) {
        items.push({
          name: this.$t('actions'),
          to: { name: 'pool-actions' }
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
        line-height: 40px;
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
