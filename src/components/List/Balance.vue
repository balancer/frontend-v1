<template>
  <div class="border-bottom py-3 d-flex">
    <Token :address="tokenAddress" size="44" class="mr-3" />
    <div class="flex-auto mt-2 pt-1">
      {{ token.symbol }}
    </div>
    <div class="column text-center">
      <Price :tokenAddress="token.address" :amount="1" />
      <div>+1%</div>
    </div>
    <div class="column text-center">
      <div class="mb-1 text-gray">{{ $n(balance) }} {{ token.symbol }}</div>
      <Price :tokenAddress="token.address" :amount="1" />
    </div>
  </div>
</template>

<script>
import config from '@/helpers/config';

export default {
  props: ['balance', 'tokenAddress'],
  computed: {
    token() {
      return config.tokens[this.tokenAddress] || {};
    }
  }
};
</script>
