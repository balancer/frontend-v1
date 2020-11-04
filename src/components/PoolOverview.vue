<template>
  <div
    class="p-4 border-left-0 border-right-0 border-md border rounded-0 rounded-md-1 panel-background"
  >
    <div class="text-white">
      {{ $t('myShare') }}: {{ _num(userShare.current, 'percent-long') }}
      <span
        v-if="userShare.future"
        v-text="`→ ${_num(userShare.future, 'percent-long')}`"
      />
    </div>
    <div class="text-white">
      {{ $t('swapFee') }}: {{ _num(pool.swapFee, 'percent') }}
    </div>
    <span
      v-for="token in pool.tokens"
      :key="token.address"
      class="mr-1 text-white"
    >
      <Icon name="bullet" size="16" :style="`color: ${token.color}`" />
      {{ _shorten(token.symbol, 12) }}
      {{ _num(token.weightPercent / 100, 'percent') }}
    </span>
  </div>
</template>

<script>
export default {
  props: ['pool', 'userShare']
};
</script>
