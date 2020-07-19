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
          <input
            v-model="weth.wrapAmount"
            class="input flex-auto text-right text-white amount-input"
            placeholder="0.0"
          />
          <UiButton class="button-outline ml-2 px-4" @click="wrapEther">
            Wrap
          </UiButton>
        </div>
        <div class="eyebrow mt-2">
          WETH → ETH
        </div>
        <div class="d-flex">
          <input
            v-model="weth.unwrapAmount"
            class="input flex-auto text-right text-white amount-input"
            placeholder="0.0"
          />
          <UiButton class="button-outline ml-2 px-3" @click="unwrapEther">
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
          <div v-if="i !== 'ether'" class="flex-auto">
            {{ _ticker(i.toLowerCase()) || 'ETH' }}
          </div>
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
import { bnum, clone, normalizeBalance } from '@/helpers/utils';

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

export default {
  data() {
    return {
      weth: {
        wrapAmount: '',
        unwrapAmount: ''
      },
      config
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
          to: { name: 'create' }
        });
        items.push({
          name: 'My Wallet',
          to: { name: 'wallet' }
        });
      }
      return items;
    },
    balances() {
      return Object.fromEntries(
        Object.entries(this.web3.balances).filter(entry => {
          const address = entry[0];
          const balance = entry[1];
          return this.web3.tokenMetadata[address] && bnum(balance).gt(0);
        })
      );
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
    formatBalance(balanceString, address) {
      const decimals =
        address === 'ether' ? 18 : this.web3.tokenMetadata[address].decimals;
      return normalizeBalance(balanceString, decimals);
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
}
</style>
