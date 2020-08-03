<template>
  <div class="p-4">
    <UiTable class="mb-4">
      <UiTableTh>
        <div class="flex-auto text-left">Tokens</div>
        <div class="column text-left">Weights</div>
        <div class="column">Deposits</div>
      </UiTableTh>
      <UiTableTr v-for="(token, i) in tokens" :key="token">
        <div class="d-flex flex-auto">
          <Token :address="token" size="22" class="mr-2" />
          {{ config.tokens[token].symbol }}
        </div>
        <div class="column text-left">
          {{ $n(startWeights[i]) }}
          <span
            class="text-gray ml-2"
            v-text="
              $n(((weightRatio * startWeights[i]) / 100).toFixed(4), 'percent')
            "
          />
        </div>
        <div class="column">
          {{ $n(startBalances[i]) }} {{ config.tokens[token].symbol }}
        </div>
      </UiTableTr>
    </UiTable>
    <UiTable>
      <UiTableTh>
        <div class="flex-auto text-left">Swap Fee</div>
        <div class="text-white" v-text="`${parseFloat(swapFee.toFixed(4))}%`" />
      </UiTableTh>
    </UiTable>
  </div>
</template>

<script>
export default {
  props: ['tokens', 'startWeights', 'startBalances', 'swapFee', 'rights'],
  computed: {
    weightRatio() {
      return 100 / this.startWeights.reduce((a, b) => a + parseFloat(b), 0);
    }
  }
};
</script>
