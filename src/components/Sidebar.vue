<template>
  <div id="sidebar" class="d-flex flex-column bottom-0 top-0">
    <Nav :items="items" class="pb-9 flex-auto" />
    <div class="p-4 border-top">
      <div class="eyebrow mb-4">
        My wallet
      </div>
      <div v-if="web3.account" class="text-white">
        <div v-for="(balance, i) in balances" :key="i" class="d-flex mb-3">
          <Token :address="i" size="20" class="mr-2" />
          <div v-if="i !== 'ether'" class="flex-auto">
            {{ config.tokens[i].symbol || 'ETH' }}
          </div>
          <div v-else class="flex-auto">ETH</div>
          <div>{{ $n(balance) }}</div>
        </div>
      </div>
      <div v-else class="text-white">
        Connect wallet to see balances
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/helpers/config';
import { clone } from '@/helpers/utils';

const startItems = [
  {
    name: 'Shared pools',
    to: { name: 'home' }
  },
  {
    name: 'Private pools',
    to: { name: 'private' }
  }
];

export default {
  data() {
    return {
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
          name: 'My pools',
          to: { name: 'my-pools' },
          count: this.subgraph.myPools.length
        });
        items.push({
          name: 'Create a pool',
          to: { name: 'create' }
        });
      }
      return items;
    },
    balances() {
      return Object.fromEntries(
        Object.entries(this.web3.balances).filter(
          balance => balance[1] >= 0.001
        )
      );
    }
  }
};
</script>

<style lang="scss">
@import '../vars';

#sidebar {
  border-right: $border;
  position: fixed;
  background-color: $panel-background;
  margin-top: 79px;
  padding-top: 20px;
  width: 264px;

  ul > li > a {
    color: $white;
    padding: 11px 24px;

    &.router-link-exact-active {
      background: $blue-900;
      border-left: 3px solid $blue;
    }
  }
}
</style>
