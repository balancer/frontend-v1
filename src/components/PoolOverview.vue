<template>
  <div class="p-3 border rounded-1">
    <h4 class="mb-2">Pool {{ _shorten(pool.id) }}</h4>
    <div class="d-flex">
      <div class="mr-3">
        <Pie :tokens="pool.tokens" size="60" />
      </div>
      <div class="text-white">
        <div class="mb-2">
          <div>Swap fee: {{ $n(pool.swapFee, 'percent') }}</div>
        </div>
        <div
          v-for="token in pool.tokens"
          :key="token.address"
          class="d-inline-block mx-1"
        >
          <Icon
            name="bullet"
            size="6"
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
  props: ['pool']
};
</script>
