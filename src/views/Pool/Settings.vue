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
  </div>
</template>

<script>
import { MAX } from '@/helpers/utils';

export default {
  props: ['pool', 'bPool'],
  data() {
    return {
      modalOpen: {
        swapFee: false,
        publicSwap: false,
        controller: false,
        cap: false
      },
      MAX
    };
  }
};
</script>
