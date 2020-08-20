<template>
  <h3 class="hide-sm">
    <span class="mr-2" v-if="pool.name" v-text="pool.name" />
    <span class="mr-2" v-else>Pool {{ _shortenAddress(pool.id) }}</span>
    <span v-if="pool.symbol" v-text="`(${_shorten(pool.symbol)})`" />
    <a :href="_etherscanLink(pool.id)" target="_blank" class="text-white">
      <Icon name="external-link" size="16" class="ml-1 mr-2" />
    </a>
    <UiLabel
      v-if="!pool.finalized"
      v-text="pool.crp ? 'Smart pool' : 'Private'"
    />
  </h3>
</template>

<script>
export default {
  props: ['pool']
};
</script>
