<template>
  <UiModal :open="open" @close="close" style="max-width: 440px;">
    <UiModalForm>
      <template slot="header">
        <h3 class="text-white mb-4">Select Token</h3>
        <Search
          v-model="query"
          @input="handleQuery"
          placeholder="Search name, symbol or address"
        />
      </template>
      <UiLoading v-if="loading" class="big py-3" />
      <ul v-else>
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
              <span class="ml-2" v-text="token.symbol" />
              <span
                class="text-red ml-2"
                v-if="isDisabled(i)"
                v-text="'Bad ERC20'"
              />
            </div>
            <span>
              <span
                class="text-gray mr-2"
                v-text="$n(token.value, 'currency')"
                v-if="token.price"
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
import { mapActions } from 'vuex';
import { getAddress } from '@ethersproject/address';
import { bnum, isValidAddress, normalizeBalance } from '@/helpers/utils';

export default {
  props: ['open', 'not'],
  data() {
    return {
      loading: false,
      query: ''
    };
  },
  computed: {
    tokens() {
      return Object.fromEntries(
        Object.entries(this.web3.tokenMetadata)
          .map(token => {
            const address = token[0];
            const decimals = token[1].decimals;
            const price = bnum(this.price.values[address] || 0);
            const balance = normalizeBalance(
              this.web3.balances[address] || 0,
              decimals
            );
            const value = price.times(balance);
            return [
              address,
              {
                decimals,
                balance: balance.toNumber(),
                price: price.toNumber(),
                value: value.toNumber(),
                symbol: token[1].symbol,
                name: token[1].name
              }
            ];
          })
          .filter(token => {
            if (this.not.includes(token[0])) {
              return false;
            }
            const query = this.query.toLowerCase();
            if (isValidAddress(query)) {
              const address = token[0].toLowerCase();
              return address === query;
            } else {
              const symbol = token[1].symbol.toLowerCase();
              return symbol.includes(query);
            }
          })
          .sort((a, b) => {
            if (a[1].value && b[1].value) return b[1].value - a[1].value;
            if (a[1].value) return -1;
            if (b[1].value) return 1;
            return b[1].balance - a[1].balance;
          })
      );
    }
  },
  methods: {
    ...mapActions([
      'loadTokenMetadata',
      'loadPricesByAddress',
      'getBalances',
      'getAllowances'
    ]),
    selectToken(token) {
      if (this.isDisabled(token)) {
        return;
      }
      this.$emit('input', token);
      this.close();
    },
    close() {
      this.$emit('close');
      this.query = '';
    },
    async handleQuery() {
      if (!isValidAddress(this.query)) {
        return;
      }
      const address = getAddress(this.query);
      if (this.web3.tokenMetadata[address]) {
        return;
      }
      this.loading = true;
      await Promise.all([
        this.loadTokenMetadata([address]),
        this.loadPricesByAddress([address]),
        this.getBalances([address]),
        this.getAllowances({
          tokens: [address],
          spender: this.web3.dsProxyAddress
        })
      ]);
      this.loading = false;
    },
    isDisabled(address) {
      const noBool = this.config.errors.noBool.includes(address);
      const transferFee = this.config.errors.transferFee.includes(address);
      return noBool || transferFee;
    }
  }
};
</script>
