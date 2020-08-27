<template>
  <UiTable class="p-4">
    <div class="mb-3">
      <div v-text="'Pool type'" class="mb-2" />
      <h5
        v-text="
          pool.finalized
            ? 'Shared pool'
            : pool.crp
            ? 'Smart pool'
            : 'Private pool'
        "
        class="text-white"
      />
    </div>
    <div v-if="pool.crp" class="mb-3">
      <div v-text="'Rights'" class="mb-2" />
      <h5 v-html="rights" class="text-white" />
    </div>
    <div class="mb-3">
      <div v-text="pool.finalized ? 'Creator' : 'Controller'" class="mb-2" />
      <h5>
        <a
          :href="_etherscanLink(pool.controller)"
          target="_blank"
          class="text-white"
        >
          <Avatar :address="pool.controller" class="mr-1" />
          {{ _shortenAddress(pool.controller) }}
          <Icon name="external-link" size="16" class="ml-1" />
        </a>
      </h5>
    </div>
    <div v-if="pool.crp" class="mb-3">
      <div v-text="'Smart pool controller'" class="mb-2" />
      <h5>
        <a
          :href="_etherscanLink(pool.crpController)"
          target="_blank"
          class="text-white"
        >
          <Avatar :address="pool.crpController" class="mr-1" />
          {{ _shortenAddress(pool.crpController) }}
          <Icon name="external-link" size="16" class="ml-1" />
        </a>
      </h5>
    </div>
    <div class="mb-3">
      <div v-text="'Creation date'" class="mb-2" />
      <h5>
        <a
          :href="_etherscanLink(pool.tx, 'tx')"
          target="_blank"
          class="text-white"
        >
          {{ $d(pool.createTime * 1e3, 'long') }}
          <Icon name="external-link" size="16" class="ml-1" />
        </a>
      </h5>
    </div>
    <template v-if="pool.finalized">
      <div class="mb-3">
        <div v-text="'BPT asset'" class="mb-2" />
        <h5>
          <a
            :href="_etherscanLink(pool.id, 'token')"
            target="_blank"
            class="text-white"
          >
            <Token :address="pool.id" class="v-align-middle mr-1" />
            {{ _shortenAddress(pool.id) }}
            <Icon name="external-link" size="16" class="ml-1" />
          </a>
        </h5>
      </div>
      <div class="mb-3">
        <div v-text="'BPT total supply'" class="mb-2" />
        <h5 v-text="_num(pool.totalShares)" class="text-white" />
      </div>
    </template>
    <div class="mb-3">
      <div v-text="'Public swap'" class="mb-2" />
      <h5
        v-text="pool.publicSwap ? 'Enabled' : 'Disabled'"
        class="text-white"
      />
    </div>
    <div class="mb-3">
      <div v-text="'Swap fee'" class="mb-2" />
      <h5 v-text="_num(pool.swapFee, 'percent')" class="text-white" />
    </div>
    <div class="mb-3">
      <div v-text="'Total swap volume'" class="mb-2" />
      <h5 v-text="_num(pool.totalSwapVolume, 'currency')" class="text-white" />
    </div>
    <div class="mb-3">
      <div v-text="'Total swap fee'" class="mb-2" />
      <h5 v-text="_num(pool.totalSwapFee, 'currency')" class="text-white" />
    </div>
  </UiTable>
</template>

<script>
import { poolRights } from '@/helpers/utils';

export default {
  props: ['pool'],
  computed: {
    rights() {
      return this.pool.rights.map(right => poolRights[right]).join('<br/>');
    }
  }
};
</script>
