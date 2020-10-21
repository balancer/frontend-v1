<template>
  <div class="border rounded-1 panel-background p-4 text-white">
    <div
      v-if="bPool.metadata.rights.canChangeWeights"
      class="border-bottom mb-4 pb-3"
    >
      <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
        <h4 v-text="$t('weights')" class="flex-auto" />
      </div>
      <div>
        <UiButton
          v-text="$t('poke')"
          class="float-right"
          @click="handlePokeWeights()"
        />
      </div>
      <label class="d-block mb-2" />      
      <div class="overflow-hidden">
        <Pie :tokens="pool.tokens" size="64" class="float-left mr-2" />
        <br />
        <span
          v-for="(token, i) in bPool.metadata.tokens"
          :key="i"
          class="float-left d-flex flex-items-right mr-3"
        >
          <Token :address="token.checksum" class="mr-2" />
          <span v-text="_ticker(token.checksum)" class="text-white" />
        </span>
       </div>

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
