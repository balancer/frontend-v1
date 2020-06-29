<template>
  <UiModal :open="open" @close="$emit('close')">
    <div class="modal-body my-5 px-4 text-center">
      <h2 class="mb-4" v-text="_shorten(pool.id)" />
      <div class="overflow-hidden text-center mb-4">
        <Pie :tokens="pool.tokens" :size="120" class="mb-2" />
        <div>
          <div
            v-for="token in pool.tokens"
            :key="token.address"
            class="text-center d-inline-block"
          >
            <Token
              :address="token.address"
              :symbol="token.symbol"
              class="mx-1"
            />
            <div style="font-size: 11px;" class="mt-n1">
              {{ $n(token.weightPercent.toFixed()) }}%
            </div>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <p>
          <label class="d-block">Swap fee</label>
          {{ $n(pool.swapFee * 100) }}%
        </p>
        <p>
          <label class="d-block">Marketcap</label>
          ${{ $n(pool.marketcap.toFixed()) }}
        </p>
        <p>
          <label class="d-block">Volume 24h</label>
          ${{ $n(pool.volume1Day.toFixed()) }}
        </p>
      </div>

      <div>
        <a
          class="btn-mktg mb-3"
          :href="`https://pools.balancer.exchange/#/pool/${pool.id}`"
          target="_blank"
        >
          See on Balancer
          <Icon name="external-link" class="ml-1" size="18" />
        </a>
        <a
          class="btn-outline mb-3"
          :href="_etherscanLink(pool.id)"
          target="_blank"
        >
          See on Etherscan
          <Icon name="external-link" class="ml-1" size="18" />
        </a>
      </div>
    </div>
  </UiModal>
</template>

<script>
export default {
  props: ['open', 'pool']
};
</script>
