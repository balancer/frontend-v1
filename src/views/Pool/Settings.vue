<template>
  <div class="border rounded-1 panel-background p-4 text-white">
    <div
      v-if="bPool.metadata.rights.canPauseSwapping"
      class="border-bottom mb-4 pb-3"
    >
      <div class="float-right">
        <UiButton v-text="$t('toggle')" @click="modalOpen.publicSwap = true" />
      </div>
      <label v-text="$t('publicSwap')" class="d-block mb-2" />
      <p
        v-text="pool.publicSwap ? $t('active') : $t('paused')"
        class="text-gray"
      />
    </div>
    <div
      v-if="bPool.metadata.rights.canChangeSwapFee"
      class="border-bottom mb-4 pb-3"
    >
      <div class="float-right">
        <UiButton v-text="$t('change')" @click="modalOpen.swapFee = true" />
      </div>
      <label v-text="$t('swapFee')" class="d-block mb-2" />
      <p v-text="_num(pool.swapFee, 'percent')" class="text-gray" />
    </div>
    <div
      v-if="bPool.metadata.rights.canChangeCap"
      class="border-bottom mb-4 pb-3"
    >
      <div class="float-right">
        <UiButton v-text="$t('change')" @click="modalOpen.cap = true" />
      </div>
      <label v-text="$t('cap')" class="d-block mb-2" />
      <div class="text-gray">
        <div v-if="pool.bspCap === MAX" v-text="$t('unlimited')" />
        <div v-else v-text="_num(pool.bspCap)" />
      </div>
    </div>
    <div
      v-if="bPool.metadata.rights.canAddRemoveTokens && 1 === 2"
      class="border-bottom mb-4 pb-3"
    >
      <div class="float-right">
        <UiButton v-text="$t('add')" @click="modalOpen.tokens = true" />
      </div>
      <label v-text="$t('tokens')" class="d-block mb-2" />
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
    <div
      v-if="bPool.metadata.rights.canChangeWeights && 1 === 2"
      class="border-bottom mb-4 pb-3"
    >
      <div class="float-right">
        <UiButton
          v-text="$t('updateGradually')"
          @click="modalOpen.gradualWeights = true"
        />
      </div>
      <div class="float-right mr-2">
        <UiButton v-text="$t('update')" @click="modalOpen.weights = true" />
      </div>
      <label v-text="$t('weights')" class="d-block mb-2" />
      <Pie :tokens="pool.tokens" size="64" class="mr-2" />
    </div>
    <div>
      <div class="float-right">
        <UiButton v-text="$t('change')" @click="modalOpen.controller = true" />
      </div>
      <label v-text="$t('controller')" class="d-block mb-2" />
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
      :value="pool.bspCap"
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
import { bnum, scale, MAX } from '@/helpers/utils';

export default {
  props: ['pool', 'bPool'],
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
      },
      MAX
    };
  },
  computed: {
    cap() {
      const address = getAddress(this.pool.controller);
      const crp = this.web3.crps[address];
      if (!crp) return '0';
      const capNumber = scale(bnum(crp.bspCap), -18);
      return capNumber.toString();
    }
  }
};
</script>
