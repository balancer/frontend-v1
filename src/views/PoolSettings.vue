<template>
  <Container>
    <div class="border-bottom mb-4 pb-3">
      <div class="float-right">
        <a @click="modalEditPublicSwapOpen = true" class="btn-outline">Edit</a>
      </div>
      <label class="d-block mb-2">Public swap</label>
      <p class="text-gray">{{ pool.publicSwap ? 'Active' : 'Paused' }}</p>
    </div>
    <div class="border-bottom mb-4 pb-3">
      <div class="float-right">
        <a @click="modalEditTokensOpen = true" class="btn-outline">Edit</a>
      </div>
      <label class="d-block mb-2">Tokens</label>
      <div v-if="pool.tokens.length" class="mb-2">
        <div
          class="text-center mr-1 d-inline-block"
          v-for="token in pool.tokens"
          :key="token.address"
        >
          <Token
            :key="token.address"
            :address="token.address"
            size="44"
            class="circle mb-2"
            style="border: 2px solid white !important;"
          />
          <div class="text-gray">{{ token.symbol }}</div>
        </div>
      </div>
    </div>
    <div class="border-bottom mb-4 pb-3">
      <div class="float-right">
        <a @click="modalEditWeightsOpen = true" class="btn-outline">Edit</a>
      </div>
      <label class="d-block mb-2">Weights</label>
      <Pie :tokens="pool.tokens" size="64" class="mr-2" />
    </div>
    <div class="border-bottom mb-4 pb-3">
      <div class="float-right">
        <a @click="modalEditSwapFeeOpen = true" class="btn-outline">Edit</a>
      </div>
      <label class="d-block mb-2">Swap fee</label>
      <p class="text-gray">{{ pool.swapFee }}%</p>
    </div>
    <ModalEditPublicSwap
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
      :value="pool.swapFee"
      :open="modalEditSwapFeeOpen"
      @close="modalEditSwapFeeOpen = false"
    />
  </Container>
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
