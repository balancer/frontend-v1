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
      v-if="bPool.metadata.rights.canChangeSwapFee"
      class="border-bottom mb-4 pb-3"
    >
      <div class="float-right">
        <UiButton v-text="$t('change')" @click="modalOpen.swapFee = true" />
      </div>
      <div v-text="$t('swapFee')" class="mb-2" />
      <h5 v-text="_num(pool.swapFee, 'percent')" class="text-white" />
    </div>
    <div v-if="bPool.metadata.rights.canChangeWeights" class="border-bottom mb-4 pb-3">
      <div class="float-right mr-2">
        <UiButton
          v-text="$t('poke')"
          class="float-right"
          @click="handlePokeWeights()"
        />
        <UiButton class="mr-2"
            v-text="$t('updateGradually')"
            @click="modalOpen.gradualWeights = true"
        />
        <UiButton class="mr-2"
            v-text="$t('update')"
            :disabled="ongoingUpdate"
            @click="modalOpen.weights = true"
        />
      </div>
      <div v-text="$t('manageWeights')" class="mb-2" />
      <br />
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
      v-if="bPool.metadata.rights.canWhitelistLPs"
      class="border-bottom mb-4 pb-3"
    >
      <div class="float-right">
        <UiButton v-text="$t('manage')" @click="modalOpen.manageWhitelist = true" />
      </div>
      <label v-text="$t('manageWhitelist')" class="d-block mb-2" />
        <br />
    </div>
    <div class="border-bottom mb-4 pb-3">      
      <div class="float-right">
        <UiButton v-text="$t('change')" @click="modalOpen.controller = true" />
      </div>
      <label v-text="$t('controller')" class="d-block mb-2" />
      <h5 v-text="pool.crpController" class="text-white" />
    </div>

    <MessageError
      v-if="this.transactionReverted"
      :text="$t('txReverted')"
      class="mt-4"
    />
    <ModalEditTokens
      :pool="bPool"
      :open="modalOpen.tokens"
      @close="closeModal('tokens')"
    />
    <ModalEditPublicSwap
      :pool="pool"
      :value="pool.publicSwap"
      :open="modalOpen.publicSwap"
      @close="closeModal('publicSwap')"
    />
    <ModalEditSwapFee
      :pool="pool"
      :value="pool.swapFee * 1e2"
      :open="modalOpen.swapFee"
      @close="closeModal('swapFee')"
    />
    <ModalEditWeights
      :pool="pool"
      :open="modalOpen.weights"
      @close="modalOpen.weights = false"
    />
    <ModalEditWeightsGradually
      :bPool="bPool"
      :pool="pool"
      :open="modalOpen.gradualWeights"
      @close="modalOpen.gradualWeights = false"
    />
    <ModalEditController
      :value="pool.crpController"
      :pool="pool"
      :open="modalOpen.controller"
      @close="closeModal('controller')"
    />
    <ModalEditCap
      :value="pool.bspCap"
      :pool="pool"
      :open="modalOpen.cap"
      @close="closeModal('cap')"
    />
    <ModalManageWhitelist
      :pool="pool"
      :open="modalOpen.manageWhitelist"
      @close="modalOpen.manageWhitelist = false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { isTxReverted, MAX } from '@/helpers/utils';

export default {
  props: ['pool', 'bPool'],
  data() {
    return {
      modalOpen: {
        tokens: false,
        swapFee: false,
        publicSwap: false,
        weights: false,
        gradualWeights: false,
        controller: false,
        cap: false,
        manageWhitelist: false
      },
      transactionReverted: false,
      MAX
    };
  },
  watch: {
    open() {
      this.transactionReverted = false;
    }
  },
  computed: {
    ongoingUpdate() {
      return this.pool.startBlock !== '0';
    }
  },
  methods: {
    ...mapActions(['pokeWeights']),
    async handlePokeWeights() {
      const txResult = await this.pokeWeights({
        poolAddress: this.bPool.metadata.controller
      });
      if (isTxReverted(txResult)) {
        this.transactionReverted = true;
      }
    },
    closeModal(key) {
      this.modalOpen[key] = false;
      this.$emit('reload');
    }
  }
};
</script>
