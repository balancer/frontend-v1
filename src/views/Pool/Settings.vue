<template>
  <div class="border rounded-1 panel-background p-4 text-white">
    <div class="border-bottom mb-4 pb-3">
      <div class="float-right">
        <UiButton @click="modalEditPublicSwapOpen = true">Edit</UiButton>
      </div>
      <label class="d-block mb-2">Public swap</label>
      <p v-text="pool.publicSwap ? 'Active' : 'Paused'" class="text-gray" />
    </div>
    <div class="border-bottom mb-4 pb-3">
      <div class="float-right">
        <UiButton @click="modalEditTokensOpen = true">Edit</UiButton>
      </div>
      <label class="d-block mb-2">Tokens</label>
      <div v-if="pool.tokens.length" class="mb-2">
        <div
          class="text-center mr-2 d-inline-block"
          v-for="token in pool.tokens"
          :key="token.address"
        >
          <Token
            :key="token.address"
            :address="token.address"
            class="mb-2"
            size="28"
          />
          <div v-text="token.symbol" />
        </div>
      </div>
    </div>
    <div class="border-bottom mb-4 pb-3">
      <div class="float-right">
        <UiButton @click="modalEditWeightsOpen = true">Edit</UiButton>
      </div>
      <label class="d-block mb-2">Weights</label>
      <Pie :tokens="pool.tokens" size="64" class="mr-2" />
    </div>
    <div class="pb-3">
      <div class="float-right">
        <UiButton @click="modalEditSwapFeeOpen = true">Edit</UiButton>
      </div>
      <label class="d-block mb-2">Swap fee</label>
      <p v-text="_num(pool.swapFee, 'percent')" class="text-gray" />
    </div>
    <ModalEditPublicSwap
      :pool="pool"
      :value="pool.publicSwap"
      :open="modalEditPublicSwapOpen"
      @close="modalEditPublicSwapOpen = false"
    />
    <ModalEditTokens
      :value="pool.tokensList"
      :open="modalEditTokensOpen"
      @close="modalEditTokensOpen = false"
    />
    <ModalEditWeights
      :pool="pool"
      :open="modalEditWeightsOpen"
      @close="modalEditWeightsOpen = false"
    />
    <ModalEditSwapFee
      :pool="pool"
      :value="pool.swapFee * 1e2"
      :open="modalEditSwapFeeOpen"
      @close="modalEditSwapFeeOpen = false"
    />
  </div>
</template>

<script>
export default {
  props: ['pool'],
  data() {
    return {
      modalEditPublicSwapOpen: false,
      modalEditTokensOpen: false,
      modalEditSwapFeeOpen: false,
      modalEditWeightsOpen: false
    };
  }
};
</script>
