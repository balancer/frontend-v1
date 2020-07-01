<template>
  <div class="p-4">
    <UiTable class="mb-4">
      <UiTableTh>
        <div class="flex-auto text-left">Tokens</div>
        <div class="text-right">Deposits</div>
      </UiTableTh>
      <UiTableTr v-for="(token, i) in tokens" :key="token">
        <div class="d-flex flex-auto">
          <Token :address="token" size="22" class="mr-2" />
          <div class="mr-2">
            {{ config.tokens[token].symbol }}
            {{ $n(startWeights[i]) }}%
          </div>
        </div>
        <div>{{ $n(startBalances[i]) }} {{ config.tokens[token].symbol }}</div>
      </UiTableTr>
    </UiTable>
    <UiTable>
      <UiTableTh>
        <div class="flex-auto text-left">Swap fee</div>
        <div class="text-white" v-text="`${$n(swapFee)}%`" />
      </UiTableTh>
    </UiTable>
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
