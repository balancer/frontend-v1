<template>
  <div class="border rounded-1 panel-background p-4">
    <div
      v-if="bPool.metadata.rights.canPauseSwapping"
      class="border-bottom mb-4 pb-3"
    >
      <div class="float-right">
        <UiButton v-text="$t('toggle')" @click="modalOpen.publicSwap = true" />
      </div>
      <div v-text="$t('publicSwap')" class="mb-2" />
      <h5
        v-text="bPool.metadata.publicSwap ? 'Enabled' : 'Disabled'"
        class="text-white"
      />
    </div>
    <div
      v-if="bPool.metadata.rights.canAddRemoveTokens"
      class="border-bottom mb-4 pb-3"
    >
      <div class="float-right">
        <UiButton
          v-text="$t('change')"
          :disabled="ongoingUpdate"
          @click="modalOpen.tokens = true"
        />
      </div>
      <label v-text="$t('tokens')" class="d-block mb-2" />
      <div class="overflow-hidden">
        <span
          v-for="(token, i) in bPool.metadata.tokens"
          :key="i"
          class="float-left d-flex flex-items-center mr-3"
        >
          <Token :address="token.checksum" class="mr-2" />
          <span v-text="_ticker(token.checksum)" class="text-white" />
        </span>
      </div>
    </div>
    <div
      v-if="bPool.metadata.rights.canChangeSwapFee"
      class="border-bottom mb-4 pb-3"
    >
      <div class="float-right">
        <UiButton v-text="$t('change')" @click="modalOpen.swapFee = true" />
      </div>
      <div v-text="$t('swapFee')" class="mb-2" />
      <h5 v-text="_num(pool.swapFee, 'percent')" class="text-white" />
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
    <div>
      <div class="float-right">
        <UiButton v-text="$t('change')" @click="modalOpen.controller = true" />
      </div>
      <label v-text="$t('controller')" class="d-block mb-2" />
      <h5 v-text="pool.crpController" class="text-white" />
    </div>
    <ModalEditTokens
      :pool="bPool"
      :open="modalOpen.tokens"
      @close="modalOpen.tokens = false"
    />
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
  </div>
</template>

<script>
import { MAX } from '@/helpers/utils';

export default {
  props: ['pool', 'bPool'],
  data() {
    return {
      modalOpen: {
        tokens: false,
        swapFee: false,
        publicSwap: false,
        controller: false,
        cap: false
      },
      MAX
    };
  },
  computed: {
    ongoingUpdate() {
      return this.pool.startBlock != "0";
    }
  }
};
</script>
