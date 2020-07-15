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
      My share: {{ $n(userShare.current, 'percent') }} →
      {{ $n(userShare.future, 'percent') }}
    </div>
    <div class="text-white">Swap fee: {{ $n(pool.swapFee, 'percent') }}</div>
    <Pie :tokens="pool.tokens" size="64" class="mr-2" />
    <div class="flex-auto text-left mt-3">
      <div class="overflow-hidden" style="max-width: 320px;">
        <div
          v-for="token in pool.tokens"
          :key="token.address"
          class="d-flex flex-items-center flex-justify-center mr-2 text-white"
          style="font-size: 12px; font-weight: 500"
        >
          <Icon
            name="bullet"
            size="4"
            class="mr-1"
            :style="`color: ${token.chartColor}`"
          />
          {{ $n(token.weightPercent.toFixed()) }}%
          {{ token.symbol }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['pool', 'userShare']
};
</script>
