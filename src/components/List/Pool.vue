<template>
  <div>
    <router-link
      :to="{ name: 'pool', params: { id: pool.id } }"
      class="d-flex flex-items-center border-top text-white px-4 py-3 highlight"
    >
      <div class="column-sm">
        {{ pool.id | shorten }}
      </div>
      <div>
        <Pie :tokens="pool.tokens" class="mr-3" size="40" />
      </div>
      <div class="flex-auto">
        <div class="d-flex flex-wrap overflow-hidden" style="max-width: 320px;">
          <div
            v-for="token in pool.tokens"
            :key="token.address"
            class="d-flex flex-items-center mr-2"
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
      <div class="text-right column">{{ $n(pool.swapFeePercent) }}%</div>
      <div class="text-right hide-sm hide-md column">
        <Price :amount="pool.totalEthValue" />
      </div>
      <div class="text-right hide-sm hide-md column">
        <Price :amount="0" />
      </div>
      <div class="text-right hide-sm hide-md column">
        <Price :amount="pool.totalVolume1Day" />
      </div>
    </router-link>
  </div>
</template>

<script>
import Icon from '../Icon';
export default {
  components: { Icon },
  props: ['pool']
};
</script>
