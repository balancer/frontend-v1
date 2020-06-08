<template>
  <div>
    <a @click="modalPoolOpen = true" class="py-3 border-bottom d-flex">
      <div class="flex-auto">
        <div>
          <Pie
            :tokens="pool.tokens"
            :totalWeight="pool.totalWeight"
            class="mr-2"
          />
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
              {{
                $n(((100 / pool.totalWeight) * token.denormWeight).toFixed())
              }}%
            </div>
          </div>
        </div>
      </div>
      <div
        class="text-gray text-center mt-3 hide-sm hide-md"
        style="width: 120px;"
      >
        ${{ $n(pool.marketcap.toFixed()) }}
      </div>
      <div
        class="text-gray text-center mt-3 hide-sm hide-md"
        style="width: 120px;"
      >
        ${{ $n(pool.volume1Day.toFixed()) }}
      </div>
      <div class="text-gray text-center mt-3" style="width: 120px;">
        {{ $n(pool.swapFee * 100) }}%
      </div>
      <div
        class="text-gray text-center mt-3 hide-sm hide-md"
        style="width: 120px;"
      >
        {{ pool.holders }}
      </div>
    </a>
    <ModalPool
      :open="modalPoolOpen"
      @close="modalPoolOpen = false"
      :pool="pool"
    />
  </div>
</template>

<script>
export default {
  props: ['pool'],
  data() {
    return {
      modalPoolOpen: false
    };
  }
};
</script>
