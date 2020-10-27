<template>
  <div class="border rounded-1 panel-background p-4 text-white">
    <div
      v-if="bPool.metadata.rights.canChangeWeights"
      class="p-4 border rounded-1"
      style="max-width: 440px;"
    >
      <h5 v-text="$t('poke')" class="mb-3" />
      <p v-html="$t('pokeWeightsInfo')" class="mb-3" />
      <UiButton
        :disabled="!ongoingUpdate"
        :loading="loading"
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
    ongoingUpdate() {
      return this.bPool.isCrp() && this.bPool.metadata.startBlock !== '0';
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
