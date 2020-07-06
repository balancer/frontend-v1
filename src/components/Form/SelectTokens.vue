<template>
  <div>
    <div class="p-4 pb-0">
      <p class="mb-4">
        Select up to height tokens you’d like to have in the pool.
      </p>
      <Search v-model="query" placeholder="Search name, symbol or address" />
    </div>
    <div
      class="text-left overflow-y-scroll border rounded-1 mt-0 m-4"
      style="height: 260px;"
    >
      <p
        class="py-3 text-center"
        v-if="query && Object.keys(tokens).length === 0"
      >
        No token found for this search
      </p>
      <a
        v-for="token in tokens"
        :key="token.address"
        class="d-flex px-3 py-2 flex-items-center line-height-0 border-bottom"
        :class="selectedTokens.includes(token.address) && 'selected'"
        @click="toggleToken(token.address)"
      >
        <Icon
          :name="
            selectedTokens.includes(token.address) ? 'check' : 'plus-small'
          "
          size="22"
          class="text-white mr-2"
        />
        <Token :address="token.address" class="mr-3" size="28" />
        <div class="flex-auto text-white">
          {{ token.symbol }}
        </div>
      </a>
    </div>
  </div>
</template>

<script>
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
              str.includes(this.query.toLowerCase()) ||
              this.selectedTokens.includes(token[1].address)
            );
          })
          .sort((a, b) => b[1].usdValue - a[1].usdValue)
      );
    }
  },
  methods: {
    toggleToken(tokenAddress) {
      const i = this.selectedTokens.indexOf(tokenAddress);
      if (i !== -1) {
        this.selectedTokens.splice(i, 1);
      } else if (this.selectedTokens.length < 8) {
        this.selectedTokens.push(tokenAddress);
      }
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
