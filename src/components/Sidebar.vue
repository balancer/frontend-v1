<template>
  <div
    id="sidebar"
    class="d-flex flex-column bottom-0 top-0 overflow-y-auto animate"
    :class="ui.sidebarIsOpen ? 'is-open' : 'is-closed'"
  >
    <Nav
      :key="$router.currentRoute.name"
      :items="items"
      class="flex-auto mb-4"
    />
  </div>
</template>

<script>
import { clone, normalizeBalance } from '@/helpers/utils';

export default {
  data() {
    return {
      weth: {
        wrapAmount: '',
        unwrapAmount: ''
      }
    };
  },
  computed: {
    items() {
      const items = [];
      if (this.web3.account) {
        items.push({
          name: 'dashboard',
          to: { name: 'home' }
        });
      }
      items.push({
        name: 'explorePools',
        to: { name: 'explore' }
      });
      if (this.web3.account) {
        items.push({
          name: 'createPool',
          to: { name: 'create' }
        });
        items.push({
          name: 'myPools',
          to: { name: 'my-pools' }
        });
        items.push({
          name: 'myWallet',
          to: { name: 'wallet' }
        });
      }

      // Translate names
      for (let i = 0; i < items.length; i++) {
        items[i].name = this.$t(items[i].name);
      }

      return items;
    },
    balances() {
      const balances = Object.fromEntries(
        Object.entries(clone(this.web3.balances))
          .filter(entry => this.getTokenValue(entry) > 0.001)
          .sort((a, b) => {
            const aValue = this.getTokenValue(a);
            const bValue = this.getTokenValue(b);
            return bValue - aValue;
          })
          .slice(0, 5)
      );
      const target = { ether: balances.ether };
      target[this.config.addresses.weth] = balances[this.config.addresses.weth];
      return Object.assign(target, balances);
    }
  },
  methods: {
    getTokenValue([address, balanceStr]) {
      if (!this.web3.tokenMetadata[address] && address !== 'ether') return 0;
      const decimals =
        address === 'ether' ? 18 : this.web3.tokenMetadata[address].decimals;
      const balance = normalizeBalance(balanceStr, decimals);
      const weth = this.config.tokens[this.config.addresses.weth];
      const price =
        address === 'ether'
          ? this.price.values[weth.address]
          : this.price.values[address];
      return balance.times(price).toNumber();
    },
    formatBalance(balanceString, address) {
      const decimals =
        address === 'ether' ? 18 : this.web3.tokenMetadata[address].decimals;
      const rawBalance = normalizeBalance(balanceString || '0', decimals);
      return this._precision(rawBalance.toNumber(), address);
    }
  }
};
</script>

<style lang="scss">
@import '../vars';

#sidebar {
  z-index: 5;
  border-right: $border;
  position: fixed;
  background-color: $panel-background;
  margin-top: 79px;
  padding-top: 20px;
  width: 264px;
  left: -264px;
  transition: left 0.2s;

  @media (min-width: $width-xl) {
    left: 0;
  }

  ul > li > a {
    color: $white;
    padding: 11px 24px;

    &.active {
      background: $blue-900;
      border-left: 3px solid $blue;
      padding-left: 21px;
    }
  }

  &.is-open {
    left: 0 !important;
  }
}
</style>

<style scoped>
.amount-input {
  width: 60%;
  background-color: transparent;
  border: none;
}
</style>
