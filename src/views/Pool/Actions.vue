<template>
  <div class="border rounded-1 panel-background p-4 text-white">
    <div
      v-if="bPool.metadata.rights.canChangeWeights"
      class="border-bottom mb-4 pb-3"
    >
      <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
        <h4 v-text="$t('manageWeights')" class="flex-auto" />
      </div>
      <div>
        <UiButton
          v-text="$t('poke')"
          class="float-right"
          @click="handlePokeWeights()"
        />
      </div>
      <div v-if="isOwner">
        <div class="float-right mr-2">
          <UiButton
            v-text="$t('updateGradually')"
            @click="modalOpen.gradualWeights = true"
          />
        </div>
        <div class="float-right mr-2">
          <UiButton
            v-text="$t('update')"
            :disabled="ongoingUpdate"
            @click="modalOpen.weights = true"
          />
        </div>
      </div>
      <label v-text="$t('weights')" class="d-block mb-2" />
      <Pie :tokens="pool.tokens" size="64" class="mr-2" />
    </div>

    <!-- disabled for now -->
    <UiButton
      v-if="bPool.metadata.rights.canWhitelistLPs && isOwner"
      class="mb-4"
      @click="modalOpen.manageWhitelist = true"
    >
      {{ $t('manageWhitelist') }}
    </UiButton>

    <MessageError
      v-if="this.transactionReverted"
      :text="$t('txReverted')"
      class="mt-4"
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
    <ModalManageWhitelist
      :pool="pool"
      :open="modalOpen.manageWhitelist"
      @close="modalOpen.manageWhitelist = false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { isTxReverted } from '@/helpers/utils';

export default {
  props: ['pool', 'bPool'],
  data() {
    return {
      modalOpen: {
        weights: false,
        gradualWeights: false,
        manageWhitelist: false
      },
      transactionReverted: false
    };
  },
  watch: {
    open() {
      this.transactionReverted = false;
    }
  },
  computed: {
    isOwner() {
      return (
        this.pool.crpController &&
        this.web3.dsProxyAddress.toLowerCase() ===
          this.pool.crpController.toLowerCase()
      );
    },
    ongoingUpdate() {
      return this.bPool.metadata.startBlock != '0';
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
    }
  }
};
</script>
