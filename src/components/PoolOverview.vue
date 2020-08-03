<template>
  <div
    class="p-4 border-left-0 border-right-0 border-md border rounded-0 rounded-md-1 panel-background"
  >
    <div class="eyebrow mb-4">
      Pool Overview
    </div>
    <div class="text-white">
      {{ _shorten(pool.id) }}
    </div>
    <div class="text-white">
      My share: {{ $n(userShare.current, 'percent') }}
      <span v-if="userShare.future">
        → {{ $n(userShare.future, 'percent') }}
      </span>
    </div>
    <div class="text-white">Swap fee: {{ $n(pool.swapFee, 'percent') }}</div>
    <div
      class="mt-2 d-flex flex-column flex-items-center flex-justify-center text-white"
    >
      <Pie :tokens="pool.tokens" size="96" />
      <div
        v-for="token in pool.tokens"
        :key="token.address"
        class="mt-1"
        style="font-size: 12px; font-weight: 500"
      >
        <Icon
          name="bullet"
          size="4"
          class="mr-1"
          :style="`color: ${token.chartColor}`"
        />
        {{ $n(token.weightPercent.toFixed()) }}%
        {{ _ticker(token.checksum) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['pool', 'userShare']
};
</script>
