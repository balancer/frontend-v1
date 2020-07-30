<template>
  <div
    id="sidebar"
    class="d-flex flex-column bottom-0 top-0 overflow-y-auto animate"
    :class="ui.sidebarIsOpen ? 'is-open' : 'is-closed'"
  >
    <Nav :items="items" class="flex-auto mb-4" />
    <div class="p-4 border-top">
      <div>
        <div class="eyebrow mt-2">
          ETH → WETH
        </div>
        <div class="d-flex">
          <div class="input d-flex flex-justify-end">
            <input
              v-model="weth.wrapAmount"
              class="flex-auto text-right text-white amount-input"
              placeholder="0.0"
            />
          </div>
          <UiButton class="ml-2 px-4" @click="wrapEther">
            Wrap
          </UiButton>
        </div>
        <div class="eyebrow mt-2">
          WETH → ETH
        </div>
        <div class="d-flex">
          <div class="input d-flex flex-items-center">
            <a @click="handleMax()">
              <UiLabel v-text="'Max'" />
            </a>
            <input
              v-model="weth.unwrapAmount"
              class="flex-auto text-right text-white amount-input ml-1"
              placeholder="0.0"
            />
          </div>
          <UiButton class="ml-2 px-3" @click="unwrapEther">
            Unwrap
          </UiButton>
        </div>
      </div>
    </div>
    <div class="p-4 border-top">
      <div class="eyebrow mb-4">
        My wallet
      </div>
      <div v-if="web3.account" class="text-white">
        <div v-for="(balance, i) in balances" :key="i" class="d-flex mb-3">
          <Token :address="i" size="20" class="mr-2" />
          <div v-text="_ticker(i)" v-if="i !== 'ether'" class="flex-auto" />
          <div v-else class="flex-auto">ETH</div>
          <div>{{ $n(formatBalance(balance, i)) }}</div>
        </div>
      </div>
      <div v-else class="text-white mb-3">
        Connect wallet to see balances
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import config from '@/helpers/config';
import { clone, normalizeBalance } from '@/helpers/utils';

const startItems = [
  {
    name: 'Shared Pools',
    to: { name: 'home' }
  },
  {
    name: 'Private Pools',
    to: { name: 'private' }
  }
];

function getToken(symbol) {
  const tokenAddresses = Object.keys(config.tokens);
  const tokenAddress = tokenAddresses.find(
    tokenAddress => config.tokens[tokenAddress].symbol === symbol
  );
  return config.tokens[tokenAddress];
}

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
      items[1].count = this.subgraph.balancer.privatePoolCount;
      if (this.web3.account) {
        items.push({
          name: 'Create a Pool',
          to: { name: 'new-pool' }
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
      );
      const target = { ether: balances.ether };
      target[config.addresses.weth] = balances[config.addresses.weth];
      return Object.assign(target, balances);
    }
  },
  methods: {
    ...mapActions(['wrap', 'unwrap']),
    wrapEther() {
      this.wrap(this.weth.wrapAmount);
    },
    unwrapEther() {
      this.unwrap(this.weth.unwrapAmount);
    },
    handleMax() {
      const weth = getToken('WETH');
      const wethBalance = this.web3.balances[weth.address];
      const balance = normalizeBalance(wethBalance, weth.decimals);
      this.weth.unwrapAmount = balance.toString();
    },
    getTokenValue(entry) {
      const address = entry[0];
      const balanceString = entry[1];
      const decimals =
        address === 'ether' ? 18 : this.web3.tokenMetadata[address].decimals;
      const balance = normalizeBalance(balanceString, decimals);
      const weth = getToken('WETH');
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

    &.router-link-exact-active {
      background: $blue-900;
      border-left: 3px solid $blue;
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
