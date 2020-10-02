<template>
  <h3 class="hide-sm">
    <span
      class="mr-2"
      v-if="pool.config.name || pool.metadata.name"
      v-text="_shorten(pool.config.name || pool.metadata.name, 24)"
    />
    <span class="mr-2" v-else>Pool {{ _shortenAddress(pool.address) }}</span>
    <span
      v-if="pool.config.symbol || pool.metadata.symbol"
      v-text="`(${_shorten(pool.config.symbol || pool.metadata.symbol)})`"
    />
    <a :href="_etherscanLink(pool.address)" target="_blank" class="text-white">
      <Icon name="external-link" size="16" class="ml-1 mr-2" />
    </a>
    <UiLabel v-if="!pool.metadata.finalized" v-text="pool.getTypeStr()" />
  </h3>
</template>

<script>
export default {
  props: ['pool']
};
</script>
