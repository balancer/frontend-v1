<template>
  <div>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h4 v-text="$t('tokenSymbol')" class="flex-auto"/>
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
      <h4 class="flex-auto">{{ $t('tokenName') }} </h4>
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
      <h4 class="flex-auto">{{ $t('initialSupply') }}</h4>
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
      <h4 class="flex-auto">{{ $t('rights') }}</h4>
    </div>
    <div>
      <div class="d-flex flex-column">
        <UiCheckbox
          :checked="rights.canPauseSwapping"
          @change="$emit('toggle-right', 'canPauseSwapping')"
        >
          <span class="ml-2 text-white">{{ $t('canPauseSwapping') }}</span>
        </UiCheckbox>
        <UiCheckbox
          :checked="rights.canChangeSwapFee"
          @change="$emit('toggle-right', 'canChangeSwapFee')"
        >
          <span class="ml-2 text-white">{{ $t('canChangeSwapFee') }}</span>
        </UiCheckbox>
        <UiCheckbox
          :checked="rights.canChangeWeights"
          @change="$emit('toggle-right', 'canChangeWeights')"
        >
          <span class="ml-2 text-white">{{ $t('canChangeWeights') }}</span>
        </UiCheckbox>
        <div v-if="rights.canChangeWeights">
          <span>{{ $t('minimumUpdatePeriod') }}: </span>
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
          <span class="ml-2 text-white">{{ $t('canAddRemoveTokens') }}</span>
        </UiCheckbox>
        <div v-if="rights.canAddRemoveTokens">
          <span>{{ $t('addTokenTimelock') }}: </span>
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
          <span class="ml-2 text-white">{{ $t('canWhitelistLPs') }}</span>
        </UiCheckbox>
        <UiCheckbox
          :checked="rights.canChangeCap"
          @change="$emit('toggle-right', 'canChangeCap')"
        >
          <span class="ml-2 text-white">{{ $t('canChangeCap') }}</span>
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
