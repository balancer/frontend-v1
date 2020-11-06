<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="$t('gradualWeightUpdate')" class="text-white" />
      </template>
      <UiTable class="m-4 mb-0">
        <UiTableTh>
          <div v-text="$t('tokens')" class="flex-auto text-left" />
          <div v-text="$t('weights')" class="column-sm" />
          <div v-text="$t('percent')" class="column" />
        </UiTableTh>
        <UiTableTr v-for="(token, i) in pool.tokens" :key="token.checksum">
          <Token :address="token.checksum" size="28" class="mr-2" />
          <div class="flex-auto text-left">
            {{ _ticker(token.checksum) }}
          </div>
          <div
            class="column-sm text-right tooltipped tooltipped-n"
            :aria-label="currentDenorm(weights[i])"
          >
            <input
              v-model="weights[i]"
              class="input text-right ml-4"
              placeholder="50"
              :class="
                isWeightInputValid(weights[i]) ? 'text-white' : 'text-red'
              "
            />
          </div>
          <div class="column text-right">
            {{
              _num(
                (
                  parseFloat(pool.tokens[i].denormWeight) / oldTotalWeight
                ).toFixed(4),
                'percent'
              )
            }}
            → {{ _num((weights[i] / totalWeight).toFixed(4), 'percent') }}
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
import { getDenorm, isValidDenormValue } from '@/helpers/weights';

const BLOCK_BUFFER = 100;

export default {
  props: ['open', 'pool', 'bPool'],
  data() {
    return {
      loading: false,
      weights: [],
      currentTime: 0,
      startBlock: 0,
      endBlock: 0
    };
  },
  watch: {
    async open(value) {
      if (value) {
        this.loading = false;
        this.weights = this.pool.tokens.map(token =>
          parseFloat(token.denormWeight)
        );
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
    totalWeight() {
      return this.weights.reduce((a, b) => a + parseFloat(b), 0);
    },
    minimumWeightChangeBlockPeriod() {
      return this.bPool.metadata.minimumWeightChangeBlockPeriod || 0;
    },
    isValid() {
      const correctStartBlock = this.startBlock >= this.web3.blockNumber;
      const correctEndBlock =
        this.endBlock - this.startBlock >= this.minimumWeightChangeBlockPeriod;
      const correctBlocks = correctStartBlock && correctEndBlock;
      const totalDenorm = this.weights.reduce((a, b) => a + parseFloat(b), 0);
      let correctWeight = true;

      for (let i = 0; i < this.pool.tokens.length; i++) {
        if (
          !isValidDenormValue(
            getDenorm((this.weights[i] / totalDenorm) * 100, false)
          )
        ) {
          correctWeight = false;
          break;
        }
      }

      return correctBlocks && correctWeight;
    }
  },
  methods: {
    ...mapActions(['updateWeightsGradually']),
    async handleSubmit() {
      this.loading = true;
      const newWeights = {};
      const totalWeight = this.weights.reduce((a, b) => a + parseFloat(b), 0);

      for (let i = 0; i < this.pool.tokens.length; i++) {
        const token = this.pool.tokens[i];
        newWeights[token.checksum] = getDenorm(
          (this.weights[i] / totalWeight) * 100,
          false
        );
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
    isWeightInputValid(weight) {
      if (!weight || isNaN(weight)) {
        return false;
      }
      // They can enter *any* positive number - system will figure out percentages, then denorms
      if (bnum(weight).lte(0)) {
        return false;
      }

      return true;
    },
    currentDenorm(weight) {
      const total = this.weights.reduce((a, b) => a + parseFloat(b), 0);

      return getDenorm((weight / total) * 100, false).toFixed(3);
    }
  }
};
</script>

<style scoped>
.input-blocknumber {
  width: 120px;
}
</style>
