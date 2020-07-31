<template>
  <div class="px-0 px-md-5 py-4">
    <Container>
      <h3 class="mb-3 px-4 px-md-0">My wallet</h3>
      <div class="d-flex mb-4">
        <div class="mr-3">
          <div class="eyebrow mt-2">
            ETH → WETH
          </div>
          <div class="d-flex">
            <div class="input d-flex flex-justify-end">
              <input
                v-model="weth.wrapAmount"
                class="flex-auto text-right text-white"
                placeholder="0.0"
              />
            </div>
            <UiButton class="ml-2 px-4" @click="wrapEther">
              Wrap
            </UiButton>
          </div>
        </div>
        <div>
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
    </Container>
    <Container slim="1">
      <UiTable class="mb-4">
        <UiTableTh>
          <div v-text="'Asset'" class="flex-auto text-left" />
          <div v-text="'Price'" class="column" />
          <div v-text="'Balance'" class="column" />
        </UiTableTh>
        <UiTableTr v-for="(balance, i) in balances" :key="i" class="f4">
          <div class="d-flex flex-auto text-left">
            <Token :address="i" size="20" class="mr-2" />
            <div v-text="_ticker(i)" v-if="i !== 'ether'" class="flex-auto" />
            <div v-else class="flex-auto">ETH</div>
          </div>
          <div>{{ $n(formatBalance(balance, i)) }}</div>
        </UiTableTr>
      </UiTable>
    </Container>
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
