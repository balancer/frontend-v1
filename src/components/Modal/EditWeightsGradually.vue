<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="$t('gradualWeightUpdate')" class="text-white" />
      </template>
      <UiTable class="m-4 mb-0">
        <UiTableTh>
          <div v-text="$t('tokens')" class="flex-auto text-left" />
          <div class="column" />
          <div v-text="$t('percentChange')" class="column" />
        </UiTableTh>
        <UiTableTr v-for="(token, i) in pool.tokens" :key="token.checksum">
          <Token :address="token.checksum" size="28" class="mr-2" />
          <div class="flex-auto text-left">
            {{ _ticker(token.checksum) }}
          </div>
          <div
            class="column-sm text-right tooltipped tooltipped-n"
            :aria-label="
              _num(parseFloat(pool.tokens[i].denormWeight).toFixed(2))
            "
          >
            {{
              _num(
                (
                  parseFloat(pool.tokens[i].denormWeight) / oldTotalWeight
                ).toFixed(4),
                'percent'
              )
            }}
            →
          </div>
          <div
            class="column-sm text-right mr-2 tooltipped tooltipped-n"
            :aria-label="_num((weights[i] / multiplier).toFixed(2))"
          >
            <input
              v-model="weights[i]"
              class="input text-center ml-4"
              placeholder="50"
              type="number"
              :min="multiplier"
              :max="100 - multiplier"
              :class="
                isWeightInputValid(weights[i]) ? 'text-white' : 'text-red'
              "
            />
          </div>
        </UiTableTr>
      </UiTable>
      <div class="m-4">
        <div class="d-flex flex-items-center mb-2">
          <div v-text="$t('startBlock')" class="flex-auto" />
          <div class="column-sm">
            <input
              v-model="startBlock"
              class="input input-blocknumber text-right ml-2"
              placeholder="0.0"
            />
          </div>
          <div
            v-text="formatBlockNumber(startBlock)"
            class="column-lg text-right"
          />
        </div>
        <div class="d-flex flex-items-center mb-2">
          <div v-text="$t('endBlock')" class="flex-auto" />
          <div class="column-sm">
            <input
              v-model="endBlock"
              class="input input-blocknumber text-right ml-2"
              placeholder="0.0"
            />
          </div>
          <div
            v-text="formatBlockNumber(endBlock)"
            class="column-lg text-right"
          />
        </div>
      </div>
      <template slot="footer">
        <UiButton @click="$emit('close')" type="button" class="mx-1">
          {{ $t('cancel') }}
        </UiButton>
        <UiButton
          :disabled="loading || !isValid"
          :loading="loading"
          type="submit"
          class="button-primary mx-1"
        >
          {{ $t('confirm') }}
        </UiButton>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';
import { blockNumberToTimestamp, bnum } from '@/helpers/utils';
import { getMaxTotalWeight, calculateNewWeights } from '@/helpers/weights';

const BLOCK_BUFFER = 100;

export default {
  props: ['open', 'pool', 'bPool'],
  data() {
    return {
      loading: false,
      weights: [],
      currentTime: 0,
      startBlock: 0,
      endBlock: 0,
      maxTotalWeight: 0,
      multiplier: 0
    };
  },
  watch: {
    async open(value) {
      if (value) {
        this.loading = false;
        // Calculate new denorm weights, equivalent to current weights
        // If this is a legacy pool, could be 49/1 - would convert to 24/1 (98/2 -> 96/4)
        // Reduce resolution if necessary
        // Both flags false: Is not shared/locked pool, want percentages back, not denorms
        this.weights = calculateNewWeights(this.pool.tokens, false, false);
        this.maxTotalWeight = getMaxTotalWeight(false);
        this.multiplier =
          100 / getMaxTotalWeight(!this.pool.rights.canChangeWeights);
        this.currentTime = Date.now();
        this.startBlock = this.web3.blockNumber + BLOCK_BUFFER;
        this.endBlock =
          this.startBlock + parseInt(this.minimumWeightChangeBlockPeriod);
      }
    }
  },
  computed: {
    oldTotalWeight() {
      return this.pool.tokens.reduce(
        (a, b) => a + parseFloat(b.denormWeight),
        0
      );
    },
    newTotalWeight() {
      return this.weights.reduce((a, b) => a + parseFloat(b), 0);
    },
    minimumWeightChangeBlockPeriod() {
      return this.bPool.metadata.minimumWeightChangeBlockPeriod || 0;
    },
    isValid() {
      const correctStartBlock = this.startBlock >= this.web3.blockNumber;
      const correctEndBlock =
        this.endBlock - this.startBlock >= this.minimumWeightChangeBlockPeriod;

      return correctStartBlock && correctEndBlock && this.newTotalWeight == 100;
    }
  },
  methods: {
    ...mapActions(['updateWeightsGradually']),
    async handleSubmit() {
      this.loading = true;
      const newWeights = {};
      for (let i = 0; i < this.pool.tokens.length; i++) {
        const token = this.pool.tokens[i];
        // Convert from percent inputs to denorm values
        newWeights[token.checksum] = this.weights[i] / this.multiplier;
      }

      await this.updateWeightsGradually({
        poolAddress: this.pool.controller,
        tokens: this.pool.tokensList,
        newWeights,
        startBlock: this.startBlock,
        endBlock: this.endBlock
      });
      this.$emit('close');
      this.loading = false;
    },
    formatBlockNumber(blockNumber) {
      const blockTimestamp = blockNumberToTimestamp(
        this.currentTime,
        this.web3.blockNumber,
        blockNumber
      );
      const blockDate = new Date(blockTimestamp);
      return blockDate.toLocaleString('en-US');
    },
    isWeightInputValid(value) {
      if (!value || isNaN(value)) {
        return false;
      }
      const weight = bnum(value);
      if (weight.lt(this.multiplier) || weight.gt(100 - this.multiplier)) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped>
.input-blocknumber {
  width: 120px;
}
</style>
