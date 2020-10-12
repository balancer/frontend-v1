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
    <FormWrapper class="p-4 border-top" />
    <div class="p-4 border-top">
      <div v-text="$t('myWallet')" class="eyebrow mb-4" />
      <div v-if="web3.account" class="text-white">
        <div v-for="(balance, i) in balances" :key="i" class="d-flex mb-3">
          <Token :address="i" size="20" class="mr-2" />
          <div v-text="_ticker(i)" v-if="i !== 'ether'" class="flex-auto" />
          <div v-else class="flex-auto">ETH</div>
          <div v-text="_num(formatBalance(balance, i))" />
        </div>
      </div>
      <div v-else class="text-white mb-3">
        {{ $t('connectWalletForBalance') }}
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config';
import { clone, normalizeBalance } from '@/helpers/utils';

const startItems = [
  {
    name: this.$t('sharedPools'),
    to: { name: 'home' }
  },
  {
    name: this.$t('smartPools'),
    to: { name: 'smart' }
  },
  {
    name: this.$t('privatePools'),
    to: { name: 'private' }
  }
];

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
      const items = clone(startItems);
      items[0].count = this.subgraph.balancer.finalizedPoolCount;
      // items[1].count = this.subgraph.balancer.crpCount;
      items[2].count = this.subgraph.balancer.privatePoolCount;
      if (this.web3.account) {
        items.push({
          name: this.$t('createPool'),
          to: { name: 'create' }
        });
        items.push({
          name: this.$t('myPools'),
          to: { name: 'my-pools' }
        });
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
      target[config.addresses.weth] = balances[config.addresses.weth];
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
