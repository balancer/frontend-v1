<template>
  <div
    class="p-4 border-left-0 border-right-0 border-md border rounded-0 rounded-md-1 panel-background"
  >
    <div class="eyebrow mb-4">
      Pool overview
    </div>
    <div class="text-white">
      {{ _shortenAddress(pool.id) }}
    </div>
    <div class="text-white">
      My share: {{ _num(userShare.current, 'percent') }}
      <span
        v-if="userShare.future"
        v-text="`→ ${_num(userShare.future, 'percent')}`"
      />
    </div>
    <div class="text-white">Swap fee: {{ _num(pool.swapFee, 'percent') }}</div>
    <div class="text-center">
      <Pie :tokens="pool.tokens" size="100" class="mt-3 mb-2" />
    </div>
    <div
      v-for="token in pool.tokens"
      :key="token.address"
      class="mt-1 text-white"
    >
      <Icon name="bullet" size="16" :style="`color: ${token.color}`" />
      {{ _num(token.weightPercent / 100, 'percent') }}
      {{ token.symbol }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['pool', 'userShare']
};
</script>
