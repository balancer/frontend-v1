<template>
  <UiTable class="p-4">
    <div v-if="bPool.config.about" class="mb-3">
      <div v-text="$t('description')" class="mb-2" />
      <h5
        v-text="bPool.config.about"
        class="text-white mb-2"
        style="max-width: 580px;"
      />
      <h5 v-if="bPool.config.learn_more">
        <a :href="bPool.config.learn_more" target="_blank">
          {{ $t('learnMore') }}
          <Icon name="external-link" size="16" class="ml-1 mr-2" />
        </a>
      </h5>
    </div>
    <div class="mb-3">
      <div v-text="$t('poolType')" class="mb-2" />
      <h5 v-text="bPool.getTypeStr()" class="text-white" />
    </div>
    <div v-if="bPool.isCrp()" class="mb-3">
      <div v-text="$t('rights')" class="mb-2" />
      <template v-if="Object.keys(rights).length > 0">
        <div v-for="(right, key) in rights" :key="key">
          <h5 v-text="poolRights[key]" class="text-white mb-1" />
        </div>
      </template>
      <h5 v-else v-text="$t('none')" class="text-white" />
    </div>
    <div v-if="rights.canChangeWeights" class="mb-3">
      <div v-text="$t('minimumUpdatePeriod')" class="mb-2" />
      <h5
        v-text="_num(bPool.metadata.minimumWeightChangeBlockPeriod)"
        class="text-white"
      />
    </div>
    <div v-if="rights.canAddRemoveTokens" class="mb-3">
      <div v-text="$t('addTokenTimelock')" class="mb-2" />
      <h5
        v-text="_num(bPool.metadata.addTokenTimeLockInBlocks)"
        class="text-white"
      />
    </div>
    <div v-if="rights.canChangeCap" class="mb-3">
      <div v-text="$t('cap')" class="mb-2" />
      <h5 v-text="_num(bPool.metadata.bspCap)" class="text-white" />
    </div>
    <div class="mb-3">
      <div
        v-text="bPool.metadata.finalized ? $t('creator') : $t('controller')"
        class="mb-2"
      />
      <h5>
        <a
          :href="_etherscanLink(bPool.metadata.controller)"
          target="_blank"
          class="text-white"
        >
          <Avatar :address="bPool.metadata.controller" class="mr-1" />
          {{ _shortenAddress(bPool.metadata.controller) }}
          <Icon name="external-link" size="16" class="ml-1" />
        </a>
      </h5>
    </div>
    <div v-if="bPool.isCrp() && bPool.metadata.crpController" class="mb-3">
      <div v-text="$t('smartPoolController')" class="mb-2" />
      <h5>
        <a
          :href="_etherscanLink(bPool.metadata.crpController)"
          target="_blank"
          class="text-white"
        >
          <Avatar :address="bPool.metadata.crpController" class="mr-1" />
          {{ _shortenAddress(bPool.metadata.crpController) }}
          <Icon name="external-link" size="16" class="ml-1" />
        </a>
      </h5>
    </div>
    <div class="mb-3">
      <div v-text="$t('creationDate')" class="mb-2" />
      <h5>
        <a
          :href="_etherscanLink(bPool.metadata.tx, 'tx')"
          target="_blank"
          class="text-white"
        >
          {{ $d(bPool.metadata.createTime * 1e3, 'long') }}
          <Icon name="external-link" size="16" class="ml-1" />
        </a>
      </h5>
    </div>
    <template v-if="bPool.metadata.finalized">
      <div class="mb-3">
        <div v-text="$t('bptAsset')" class="mb-2" />
        <h5>
          <a
            :href="_etherscanLink(bPool.address, 'token')"
            target="_blank"
            class="text-white"
          >
            <Token :address="bPool.address" class="v-align-middle mr-1" />
            {{ _shortenAddress(bPool.address) }}
            <Icon name="external-link" size="16" class="ml-1" />
          </a>
        </h5>
      </div>
      <div class="mb-3">
        <div v-text="$t('bptTotalSupply')" class="mb-2" />
        <h5 v-text="_num(bPool.metadata.totalShares)" class="text-white" />
      </div>
    </template>
    <div class="mb-3">
      <div v-text="$t('publicSwap')" class="mb-2" />
      <h5
        v-text="bPool.metadata.publicSwap ? 'Enabled' : 'Disabled'"
        class="text-white"
      />
    </div>
    <div class="mb-3">
      <div v-text="$t('swapFee')" class="mb-2" />
      <h5 v-text="_num(bPool.metadata.swapFee, 'percent')" class="text-white" />
    </div>
    <div class="mb-3">
      <div v-text="$t('totalSwapVolume')" class="mb-2" />
      <h5
        v-text="_num(bPool.metadata.totalSwapVolume, 'currency')"
        class="text-white"
      />
    </div>
    <div class="mb-3">
      <div v-text="$t('totalSwapFee')" class="mb-2" />
      <h5
        v-text="_num(bPool.metadata.totalSwapFee, 'currency')"
        class="text-white"
      />
    </div>
  </UiTable>
</template>

<script>
import { filterObj, poolRights } from '@/helpers/utils';

export default {
  props: ['bPool'],
  data() {
    return {
      poolRights
    };
  },
  computed: {
    rights() {
      return filterObj(this.bPool.metadata.rights, right => right[1]);
    }
  }
};
</script>
