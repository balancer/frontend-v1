<template>
  <UiTableTr>
    <div class="flex-auto text-left">
      <router-link
        :to="{ name: 'explore', query: { token: [checksum], filter: 1 } }"
        class="text-white d-flex flex-items-center"
      >
        <Token :address="token.address" :symbol="token.symbol" class="mr-1" />
        <Icon
          :style="`color: ${token.color}`"
          name="bullet"
          size="16"
          class="mt-1"
        />
        {{ _shorten(token.symbol, 12) }}
      </router-link>
    </div>
    <UiNum :value="token.weightPercent / 1e2" format="percent" class="column" />
    <UiNum :value="tokenBalance" class="column hide-sm" />
    <UiNum :value="myPoolBalance" class="column hide-sm hide-md" />
    <UiNum
      :value="myShareValue"
      format="currency"
      class="column hide-sm hide-md hide-lg"
    />
  </UiTableTr>
</template>

<script>
import { getAddress } from '@ethersproject/address';
import { normalizeBalance } from '@/helpers/utils';

export default {
  props: ['pool', 'bPool', 'token'],
  computed: {
    poolTokenBalance() {
      const bptAddress = this.bPool.getBptAddress();
      const balance = this.web3.balances[getAddress(bptAddress)];
      return normalizeBalance(balance || '0', 18);
    },
    totalShares() {
      return parseFloat(this.bPool.metadata.totalShares);
    },
    checksum() {
      return getAddress(this.token.address);
    },
    myPoolBalance() {
      if (!this.poolTokenBalance) return 0;
      const balance =
        (this.poolTokenBalance / this.totalShares) * this.token.balance;
      return this._precision(balance, this.token.checksum);
    },
    myShareValue() {
      const price = this.price.values[this.token.checksum];
      return price * this.myPoolBalance;
    },
    tokenBalance() {
      return this._precision(
        parseFloat(this.token.balance),
        this.token.checksum
      );
    }
  }
};
</script>
