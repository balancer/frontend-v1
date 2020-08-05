<template>
  <UiTable class="p-4">
    <div style="max-width: 540px;">
      <div class="py-2 d-flex">
        <span v-text="'Pool type'" class="flex-auto text-left" />
        <span
          v-text="pool.finalized ? 'Shared pool' : 'Private pool'"
          class="text-white"
        />
      </div>
      <div class="py-2 d-flex">
        <span
          v-text="pool.finalized ? 'Creator' : 'Controller'"
          class="flex-auto text-left"
        />
        <span>
          <a
            :href="_etherscanLink(pool.controller)"
            target="_blank"
            class="text-white"
          >
            <Avatar :address="pool.controller" class="mr-1" />
            {{ _shorten(pool.controller) }}
            <Icon name="external-link" size="16" class="ml-1" />
          </a>
        </span>
      </div>
      <div class="py-2 d-flex">
        <span v-text="'Creation date'" class="flex-auto text-left" />
        <a
          :href="_etherscanLink(pool.tx, 'tx')"
          target="_blank"
          class="text-white"
        >
          {{ $d(pool.createTime * 1e3, 'long') }}
          <Icon name="external-link" size="16" class="ml-1" />
        </a>
      </div>
      <template v-if="pool.finalized">
        <div class="py-2 d-flex">
          <span v-text="'BPT asset'" class="flex-auto text-left" />
          <a
            :href="_etherscanLink(pool.id, 'token')"
            target="_blank"
            class="text-white"
          >
            <Token :address="pool.id" class="v-align-middle mr-1" />
            {{ _shorten(pool.id) }}
            <Icon name="external-link" size="16" class="ml-1" />
          </a>
        </div>
        <div class="py-2 d-flex">
          <span v-text="'BPT total supply'" class="flex-auto text-left" />
          <span v-text="_n(pool.totalShares)" class="text-white" />
        </div>
      </template>
      <div class="py-2 d-flex">
        <span v-text="'Public swap'" class="flex-auto text-left" />
        <span
          v-text="pool.publicSwap ? 'Enabled' : 'Disabled'"
          class="text-white"
        />
      </div>
      <div class="py-2 d-flex">
        <span v-text="'Swap fee'" class="flex-auto text-left" />
        <span v-text="_n(pool.swapFee, 'percent')" class="text-white" />
      </div>
      <div class="py-2 d-flex">
        <span v-text="'Total swap volume'" class="flex-auto text-left" />
        <span
          v-text="_n(pool.totalSwapVolume, 'currency')"
          class="text-white"
        />
      </div>
      <div class="py-2 d-flex">
        <span v-text="'Total swap fee'" class="flex-auto text-left" />
        <span v-text="_n(pool.totalSwapFee, 'currency')" class="text-white" />
      </div>
    </div>
  </UiTable>
</template>

<script>
export default {
  props: ['pool']
};
</script>
