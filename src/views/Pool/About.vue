<template>
  <UiTable class="p-4">
    <div v-if="bPool.getAbout()" class="mb-3">
      <div v-text="'Description'" class="mb-2" />
      <h5 v-text="bPool.getAbout()" class="text-white" />
    </div>
    <div class="mb-3">
      <div v-text="'Pool type'" class="mb-2" />
      <h5 v-text="bPool.getTypeStr()" class="text-white" />
    </div>
    <div v-if="bPool.isCrp()" class="mb-3">
      <div v-text="'Rights'" class="mb-2" />
      <template v-if="Object.keys(bPool.metadata.rights).length > 0">
        <div v-for="(right, key) in bPool.metadata.rights" :key="key">
          <h5 v-text="poolRights[key]" class="text-white mb-1" />
        </div>
      </template>
      <h5 v-else v-text="'None'" class="text-white" />
    </div>
    <div class="mb-3">
      <div
        v-text="bPool.metadata.finalized ? 'Creator' : 'Controller'"
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
      <div v-text="'Smart pool controller'" class="mb-2" />
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
      <div v-text="'Creation date'" class="mb-2" />
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
        <div v-text="'BPT asset'" class="mb-2" />
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
        <div v-text="'BPT total supply'" class="mb-2" />
        <h5 v-text="_num(bPool.metadata.totalShares)" class="text-white" />
      </div>
    </template>
    <div class="mb-3">
      <div v-text="'Public swap'" class="mb-2" />
      <h5
        v-text="bPool.metadata.publicSwap ? 'Enabled' : 'Disabled'"
        class="text-white"
      />
    </div>
    <div class="mb-3">
      <div v-text="'Swap fee'" class="mb-2" />
      <h5 v-text="_num(bPool.metadata.swapFee, 'percent')" class="text-white" />
    </div>
    <div class="mb-3">
      <div v-text="'Total swap volume'" class="mb-2" />
      <h5
        v-text="_num(bPool.metadata.totalSwapVolume, 'currency')"
        class="text-white"
      />
    </div>
    <div class="mb-3">
      <div v-text="'Total swap fee'" class="mb-2" />
      <h5
        v-text="_num(bPool.metadata.totalSwapFee, 'currency')"
        class="text-white"
      />
    </div>
  </UiTable>
</template>

<script>
import { poolRights } from '@/helpers/utils';

export default {
  props: ['bPool'],
  data() {
    return {
      poolRights
    };
  }
};
</script>
