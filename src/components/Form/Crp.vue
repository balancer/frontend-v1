<template>
  <div>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h4 v-text="$t('tokenSymbol')" class="flex-auto" />
    </div>
    <div class="mb-4">
      <input
        class="input pool-input text-right text-white"
        :value="tokenSymbol"
        @change="$emit('change-symbol', $event.target.value)"
        placeholder="BPT"
      />
    </div>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h4 v-text="$t('tokenName')" class="flex-auto" />
    </div>
    <div class="mb-4">
      <input
        class="input pool-input text-right text-white"
        :value="tokenName"
        @change="$emit('change-name', $event.target.value)"
        placeholder="Balancer Smart Pool"
      />
    </div>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h4 v-text="$t('initialSupply')" class="flex-auto" />
    </div>
    <div class="mb-4">
      <input
        class="ml-2 input pool-input text-right text-white"
        :value="initialSupply"
        type="number"
        :min="100"
        :max="1000000000"
        :step="100"
        @change="$emit('change-initial-supply', $event.target.value)"
        placeholder="100"
      />
    </div>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h4 v-text="$t('rights')" class="flex-auto" />
    </div>
    <div>
      <div class="d-flex flex-column">
        <UiCheckbox
          :checked="rights.canPauseSwapping"
          @change="$emit('toggle-right', 'canPauseSwapping')"
        >
          <span v-text="$t('canPauseSwapping')" class="ml-2 text-white" />
        </UiCheckbox>
        <UiCheckbox
          :checked="rights.canChangeSwapFee"
          @change="$emit('toggle-right', 'canChangeSwapFee')"
        >
          <span v-text="$t('canChangeSwapFee')" class="ml-2 text-white" />
        </UiCheckbox>
        <UiCheckbox
          :checked="rights.canChangeWeights"
          @change="$emit('toggle-right', 'canChangeWeights')"
        >
          <span v-text="$t('canChangeWeights')" class="ml-2 text-white" />
        </UiCheckbox>
        <div v-if="rights.canChangeWeights">
          <span v-text="$t('minimumUpdatePeriod')" />
          <input
            class="ml-2 input pool-input text-right text-white"
            type="number"
            :value="minimumWeightChangeBlockPeriod"
            :min="0"
            :step="10"
            @change="$emit('change-weight-period', $event.target.value)"
            placeholder="10"
          />
          <div class="d-flex flex-items-center p-4 warning-box">
            <Icon name="info" size="22" class="mr-4" />
            {{ `${$t('percentRange', { min: divisor, max: maxPercentage })}` }}
          </div>
        </div>
        <UiCheckbox
          :checked="rights.canAddRemoveTokens"
          @change="$emit('toggle-right', 'canAddRemoveTokens')"
        >
          <span v-text="$t('canAddRemoveTokens')" class="ml-2 text-white" />
        </UiCheckbox>
        <div v-if="rights.canAddRemoveTokens">
          <span v-text="$t('addTokenTimelock')" />
          <input
            class="ml-2 input pool-input text-right text-white"
            type="number"
            :min="0"
            :step="10"
            :value="addTokenTimeLockInBlocks"
            @change="$emit('change-add-timelock', $event.target.value)"
            placeholder="10"
          />
        </div>
        <UiCheckbox
          :checked="rights.canWhitelistLPs"
          @change="$emit('toggle-right', 'canWhitelistLPs')"
        >
          <span
            v-text="$t('canWhitelistLPs')"
            class="ml-2 text-white tooltipped tooltipped-n"
            :aria-label="$t('whitelistExplanation')"
          />
        </UiCheckbox>
        <UiCheckbox
          :checked="rights.canChangeCap"
          @change="$emit('toggle-right', 'canChangeCap')"
        >
          <span
            v-text="$t('canChangeCap')"
            class="ml-2 text-white tooltipped tooltipped-n"
            :aria-label="$t('capRightExplanation')"
          />
        </UiCheckbox>
      </div>
    </div>
  </div>
</template>

<script>
import { getMaxTotalWeight, getMaxPercentage } from '@/helpers/weights';

// Testing Guide
//
// With all rights unchecked, divisor = 2, maxPercentage = 98 (100 - 2)
// Check canChangeWeights; then divisor = 4, maxPercentage = 96 (100 - 4)
// Uncheck canChangeWeights; then divisor/maxPercentage return to 2/98
//

export default {
  props: [
    'tokenSymbol',
    'tokenName',
    'rights',
    'minimumWeightChangeBlockPeriod',
    'addTokenTimeLockInBlocks',
    'initialSupply'
  ],
  computed: {
    // The "resolution" of the pool depends on its type
    // A shared pool, or a smart pool with fixed weights, can have the full range of denorm weights (1-49)
    // A smart pool with canChangeWeights enabled can get "stuck" during gradual weight changes if the total
    //   is too close to the max. So we use the core pool max of 50 for shared pools (2% resolution), but
    // limit the total denorm to 25 (4% resolution) for smart pools.
    //
    // Display this range to the user as a percentage
    //   e.g.; 4% - 96%, when the max total is 25 (denorm range 1-24)
    //
    // The input on the main component will show an error outside this range; the intent here is to explain it to the user
    // Denorm weights are calculated as <input percentage> / <divisor>
    //
    // For instance, for a shared pool with percentages set to 90/10, the divisor would be 100 / 50 = 2, so denorms are 45/5
    //   For a smart pool with canChangeWeights, the max total is 25, divisor is 100 / 25 = 4, so denorms are 22.5/2.5
    divisor() {
      return 100 / getMaxTotalWeight(this.isSharedOrLocked());
    },
    maxPercentage() {
      return getMaxPercentage(this.isSharedOrLocked());
    }
  },
  methods: {
    // Since this form means we're already editing a smart pool, we only have to check for weight permission
    isSharedOrLocked() {
      return !this.rights.canChangeWeights;
    }
  }
};
</script>

<style scoped>
.pool-input {
  width: 100px;
}
</style>
