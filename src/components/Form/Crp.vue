<template>
  <div>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h4 class="flex-auto" v-text="'Token symbol'" />
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
      <h4 class="flex-auto" v-text="'Token name'" />
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
      <h4 class="flex-auto">Initial supply</h4>
    </div>
    <div class="mb-4">
      <input
        class="ml-2 input pool-input text-right text-white"
        :value="initialSupply"
        @change="$emit('change-initial-supply', $event.target.value)"
        placeholder="100"
      />
    </div>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h4 class="flex-auto" v-text="'Rights'" />
    </div>
    <div>
      <div class="d-flex flex-column">
        <UiCheckbox
          :checked="rights.canPauseSwapping"
          @change="$emit('toggle-right', 'canPauseSwapping')"
        >
          <span class="ml-2 text-white">Can pause swapping</span>
        </UiCheckbox>
        <UiCheckbox
          :checked="rights.canChangeSwapFee"
          @change="$emit('toggle-right', 'canChangeSwapFee')"
        >
          <span class="ml-2 text-white">Can change swap fee</span>
        </UiCheckbox>
        <UiCheckbox
          :checked="rights.canChangeWeights"
          @change="$emit('toggle-right', 'canChangeWeights')"
        >
          <span class="ml-2 text-white">Can change weights</span>
        </UiCheckbox>
        <div v-if="rights.canChangeWeights">
          <span>Minimum update period (in blocks): </span>
          <input
            class="ml-2 input pool-input text-right text-white"
            :value="minimumWeightChangeBlockPeriod"
            @change="$emit('change-weight-period', $event.target.value)"
            placeholder="10"
          />
        </div>
        <UiCheckbox
          :checked="rights.canAddRemoveTokens"
          @change="$emit('toggle-right', 'canAddRemoveTokens')"
        >
          <span class="ml-2 text-white">Can change tokens</span>
        </UiCheckbox>
        <div v-if="rights.canAddRemoveTokens">
          <span>Token adding minimal timelock (in blocks): </span>
          <input
            class="ml-2 input pool-input text-right text-white"
            :value="addTokenTimeLockInBlocks"
            @change="$emit('change-add-timelock', $event.target.value)"
            placeholder="10"
          />
        </div>
        <UiCheckbox
          :checked="rights.canWhitelistLPs"
          @change="$emit('toggle-right', 'canWhitelistLPs')"
        >
          <span class="ml-2 text-white">Can limit LPs</span>
        </UiCheckbox>
        <UiCheckbox
          :checked="rights.canChangeCap"
          @change="$emit('toggle-right', 'canChangeCap')"
        >
          <span class="ml-2 text-white">Can change pool cap</span>
        </UiCheckbox>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'tokenSymbol',
    'tokenName',
    'rights',
    'minimumWeightChangeBlockPeriod',
    'addTokenTimeLockInBlocks',
    'initialSupply'
  ]
};
</script>

<style scoped>
.pool-input {
  width: 100px;
}
</style>
