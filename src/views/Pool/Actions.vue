<template>
  <div class="border rounded-1 panel-background p-4 text-white">
    <div
      v-if="bPool.metadata.rights.canChangeWeights"
      class="p-4 border rounded-1"
      style="max-width: 440px;"
    >
      <h5 v-text="$t('poke')" class="mb-3" />
      <p v-html="$t('pokeWeightsEarly')" class="mb-3" v-if="tooEarly" />
      <p
        v-html="$t('pokeWeightsOngoing')"
        class="mb-3"
        v-else-if="activeUpdate"
      />
      <p v-html="$t('pokeWeightsGeneral')" class="mb-3" v-else />
      <UiButton
        :loading="loading"
        :disabled="!ongoingUpdate"
        @click="handlePokeWeights()"
      >
        {{ $t('poke') }}
      </UiButton>
    </div>
    <MessageError
      v-if="this.transactionReverted"
      :text="$t('txReverted')"
      class="mt-4"
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
      loading: false,
      transactionReverted: false
    };
  },
  watch: {
    open() {
      this.transactionReverted = false;
    }
  },
  computed: {
    // ongoingUpdate is true if a CRP has started a gradualWeightsUpdate
    ongoingUpdate() {
      return this.bPool.isCrp() && this.bPool.metadata.startBlock !== '0';
    },
    // activeUpdate is true if it has started a gradualWeightsUpdate AND it's not too early to call pokeWeights
    // Note that it's possible for the websocket interface to go down, in which case the blockNumber will be
    //   incorrect. If this happens, we do not want users to be blocked from calling pokeWeights. So only
    //   use activeUpdate for non-critical messaging, and only disable the button if it's a shared pool or
    //   updateGradualWeightsUpdate was never called. (startBlock is obtained through multicall, which should be reliable.)
    activeUpdate() {
      return (
        this.bPool.isCrp() &&
        this.bPool.metadata.startBlock !== '0' &&
        this.web3.blockNumber >= this.bPool.metadata.startBlock
      );
    },
    tooEarly() {
      return (
        this.bPool.isCrp() &&
        this.bPool.metadata.startBlock !== '0' &&
        this.web3.blockNumber < this.bPool.metadata.startBlock
      );
    }
  },
  methods: {
    ...mapActions(['pokeWeights']),
    async handlePokeWeights() {
      this.loading = true;
      const txResult = await this.pokeWeights({
        poolAddress: this.bPool.metadata.controller
      });
      if (isTxReverted(txResult)) this.transactionReverted = true;
      this.loading = false;
    }
  }
};
</script>
