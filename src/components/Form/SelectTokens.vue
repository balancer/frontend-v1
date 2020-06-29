<template>
  <div>
    <h2 class="mb-4">Select tokens</h2>
    <div
      v-if="selectedTokens.length"
      class="tokens-selectable d-inline-block mx-auto mb-4"
    >
      <div
        class="token-selectable line-height-0 bg-white circle d-inline-block mr-n2 ml-n2 position-relative anim-pulse-in"
        v-for="selectedToken in selectedTokens"
        :key="selectedToken"
      >
        <a @click="removeToken(selectedToken)">
          <Icon
            name="close"
            class="close position-absolute top-0 right-0 circle bg-blue text-white p-1"
            size="14"
          />
        </a>
        <Token
          :key="selectedToken"
          :address="selectedToken"
          size="58"
          class="circle"
          style="border: 2px solid white !important;"
        />
      </div>
    </div>
    <Search
      v-model="query"
      placeholder="Search name, symbol or address"
      class="bg-blue-light px-4"
    />
    <div class="text-left overflow-y-scroll mb-4" style="height: 260px;">
      <p
        class="px-4 py-3 mt-1 text-center"
        v-if="query && Object.keys(tokens).length === 0"
      >
        No token found for this search
      </p>
      <a
        v-for="token in tokens"
        :key="token.address"
        class="d-flex px-4 py-3 border-bottom"
        @click="selectToken(token.address)"
      >
        <Token :address="token.address" class="mr-2" />
        <div class="flex-auto mt-1 ml-1">
          <span class="text-gray mr-2">{{ token.name }}</span>
          <span class="text-normal">{{ token.symbol }}</span>
        </div>
        <div class="mt-1 text-normal" v-if="token.balance >= 0.001">
          {{ $n(token.balance) }}
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import config from '@/helpers/config';

export default {
  props: ['value'],
  data() {
    return {
      query: '',
      selectedTokens: []
    };
  },
  computed: {
    tokens() {
      return Object.fromEntries(
        Object.entries(config.tokens)
          .map(token => {
            token[1].balance = this.ui.balances[token[1].address];
            token[1].usdValue = this.getPrice(
              token[1].address,
              this.ui.balances[token[1].address]
            );
            return token;
          })
          .filter(token => {
            const str = `${token[1].address} ${token[1].symbol} ${token[1].name}`.toLowerCase();
            return (
              str.includes(this.query.toLowerCase()) &&
              !this.selectedTokens.includes(token[1].address)
            );
          })
          .sort((a, b) => b[1].usdValue - a[1].usdValue)
      );
    }
  },
  methods: {
    selectToken(tokenAddress) {
      if (this.selectedTokens.length < 8)
        this.selectedTokens.push(tokenAddress);
      this.$emit('input', this.selectedTokens);
    },
    removeToken(tokenAddress) {
      this.selectedTokens = this.selectedTokens.filter(
        token => token !== tokenAddress
      );
      this.$emit('input', this.selectedTokens);
    }
  },
  created() {
    this.selectedTokens = this.value;
  }
};
</script>
