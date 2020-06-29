<template>
  <div class="mb-6">
    <h2 class="mb-4">Preview</h2>
    <div class="px-4 text-left">
      <div class="d-flex mb-3">
        <label class="d-block flex-auto">Tokens</label>
        <label class="d-block text-right">Deposits</label>
      </div>
      <div class="mb-6">
        <div v-for="(token, i) in tokens" :key="token" class="border-top">
          <div class="d-flex my-2">
            <Token :address="token" size="40" class="mr-2 pr-1 mt-1" />
            <div class="mt-2 pt-1 text-gray mr-2 flex-auto">
              {{ config.tokens[token].symbol }}
            </div>
            <div class="my-2 py-1 text-gray text-right">
              <span class="mr-2">
                {{ $n(startBalances[i]) }} {{ config.tokens[token].symbol }}
              </span>
              {{ $n(startWeights[i]) }}%
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label class="mb-2 d-block">Swap fee</label>
        <div class="text-normal text-gray" v-text="`${$n(swapFee)}%`" />
      </div>
      <div class="mb-3">
        <label class="mb-2 d-block">Rights</label>
        <div class="text-normal text-gray" v-text="rightsStr" />
      </div>
    </div>
  </div>
</template>

<script>
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import config from '@/helpers/config';

export default {
  props: ['tokens', 'startWeights', 'startBalances', 'swapFee', 'rights'],
  data() {
    return {
      config
    };
  },
  computed: {
    rightsStr() {
      const rightsStr = Object.entries(this.rights)
        .filter(right => right[1] === true)
        .map(right => startCase(right[0]).toLowerCase())
        .join(', ');
      return capitalize(rightsStr);
    }
  }
};
</script>
