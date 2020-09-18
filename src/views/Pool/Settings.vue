<template>
  <div class="border rounded-1 panel-background p-4 text-white">
    <div class="border-bottom mb-4 pb-3">
      <div class="float-right">
        <UiButton @click="modalOpen.publicSwap = true">Toggle</UiButton>
      </div>
      <label class="d-block mb-2">Public swap</label>
      <p v-text="pool.publicSwap ? 'Active' : 'Paused'" class="text-gray" />
    </div>
    <div class="border-bottom mb-4 pb-3">
      <div class="float-right">
        <UiButton @click="modalOpen.swapFee = true">Change</UiButton>
      </div>
      <label class="d-block mb-2">Swap fee</label>
      <p v-text="_num(pool.swapFee, 'percent')" class="text-gray" />
    </div>
    <div class="border-bottom mb-4 pb-3">
      <div class="float-right">
        <UiButton @click="modalOpen.cap = true">Change</UiButton>
      </div>
      <label class="d-block mb-2">Cap</label>
      <p v-text="_num(cap)" class="text-gray" />
    </div>
    <div class="border-bottom mb-4 pb-3">
      <div class="float-right">
        <UiButton @click="modalOpen.tokens = true">Add</UiButton>
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
        <UiButton @click="modalOpen.gradualWeights = true"
          >Update gradually</UiButton
        >
      </div>
      <div class="float-right mr-2">
        <UiButton @click="modalOpen.weights = true">Update</UiButton>
      </div>
      <label class="d-block mb-2">Weights</label>
      <Pie :tokens="pool.tokens" size="64" class="mr-2" />
    </div>
    <div class="pb-3">
      <div class="float-right">
        <UiButton @click="modalOpen.controller = true">Change</UiButton>
      </div>
      <label class="d-block mb-2">Controller</label>
      <p v-text="pool.crpController" class="text-gray" />
    </div>
    <ModalEditPublicSwap
      :pool="pool"
      :value="pool.publicSwap"
      :open="modalOpen.publicSwap"
      @close="modalOpen.publicSwap = false"
    />
    <ModalEditSwapFee
      :pool="pool"
      :value="pool.swapFee * 1e2"
      :open="modalOpen.swapFee"
      @close="modalOpen.swapFee = false"
    />
    <ModalEditController
      :value="pool.crpController"
      :pool="pool"
      :open="modalOpen.controller"
      @close="modalOpen.controller = false"
    />
    <ModalEditCap
      :value="cap"
      :pool="pool"
      :open="modalOpen.cap"
      @close="modalOpen.cap = false"
    />
    <ModalEditWeights
      :pool="pool"
      :open="modalOpen.weights"
      @close="modalOpen.weights = false"
    />
    <ModalEditWeightsGradually
      :pool="pool"
      :open="modalOpen.gradualWeights"
      @close="modalOpen.gradualWeights = false"
    />
    <ModalEditTokens
      :value="pool.tokensList"
      :open="modalOpen.tokens"
      @close="modalOpen.tokens = false"
    />
  </div>
</template>

<script>
import { getAddress } from '@ethersproject/address';

import { bnum, scale } from '@/helpers/utils';

export default {
  props: ['pool'],
  data() {
    return {
      modalOpen: {
        swapFee: false,
        publicSwap: false,
        controller: false,
        cap: false,
        weights: false,
        gradualWeights: false,
        tokens: false
      }
    };
  },
  computed: {
    cap() {
      const address = getAddress(this.pool.controller);
      const crp = this.web3.crps[address];
      if (!crp) {
        return '0';
      }
      const capNumber = scale(bnum(crp.bspCap), -18);
      return capNumber.toString();
    }
  }
};
</script>
