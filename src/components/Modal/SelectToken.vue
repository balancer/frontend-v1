<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm>
      <template slot="header">
        <h3 class="text-white mb-4">Select Token</h3>
        <Search v-model="query" placeholder="Search name, symbol or address" />
      </template>
      <ul style="max-height: 500px;">
        <li
          class="py-3 text-center"
          v-if="query && Object.keys(tokens).length === 0"
        >
          No token found for this search
        </li>
        <li v-for="(token, i) in tokens" :key="i">
          <a
            @click="selectToken(i)"
            class="p-3 d-flex flex-items-center text-white border-bottom highlight"
          >
            <div class="flex-auto d-flex flex-items-center">
              <Token :address="i" class="mr-2" />
              {{ token.name }}
              <span class="text-gray ml-2" v-text="token.symbol" />
            </div>
            <span v-if="token.balance">
              <span
                class="text-gray mr-2"
                v-text="$n(token.balanceUSD, 'currency')"
              />
              {{ $n(token.balance) }}
            </span>
          </a>
        </li>
      </ul>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { getAddress } from 'ethers/utils';
import { normalizeBalance } from '@/helpers/utils';

export default {
  props: ['open', 'not'],
  data() {
    return {
      query: ''
    };
  },
  computed: {
    tokens() {
      return Object.fromEntries(
        Object.entries(this.subgraph.tokenPrices)
          .map(token => {
            const balance = normalizeBalance(
              this.web3.balances[getAddress(token[0])] || 0,
              token[1].decimals
            );
            token[1].balance = balance || 0;
            token[1].balanceUSD = this.getPrice(token[0], token[1].balance);
            console.log(token[0], token[1]);
            return token;
          })
          .filter(token => {
            const tokenStr = `${token[1].id} ${token[1].symbol}`.toLowerCase();
            return (
              tokenStr.includes(this.query.toLowerCase()) &&
              !this.not.includes(token[0])
            );
          })
          .sort((a, b) => b[1].balanceUSD - a[1].balanceUSD)
      );
    }
  },
  methods: {
    selectToken(token) {
      this.$emit('input', token);
      this.$emit('close');
    }
  }
};
</script>
