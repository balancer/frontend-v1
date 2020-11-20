<template>
  <div class="d-block text-center text-md-left d-md-flex flex-auto pb-4">
    <div class="pt-1">
      <Token
        v-if="pool.isWhitelisted()"
        :custom="true"
        :address="pool.getBptAddress()"
        size="44"
        class="mr-0 mr-md-3"
      />
      <Pie
        :tokens="pool.metadata.tokens"
        size="44"
        class="mr-0 mr-md-3"
        v-else
      />
    </div>
    <div>
      <a :href="_etherscanLink(pool.getBptAddress(), 'token')" target="_blank">
        <span
          v-if="pool.config.name || pool.metadata.name"
          v-text="_shorten(pool.config.name || pool.metadata.name, 24)"
        />
        <span v-else>
          {{ $t('pool') }} {{ _shortenAddress(pool.address) }}
        </span>
        <span
          v-if="pool.config.symbol || pool.metadata.symbol"
          v-text="`(${_shorten(pool.config.symbol || pool.metadata.symbol)})`"
          class="ml-1"
        />
        <Icon name="external-link" size="16" class="ml-1 mr-2" />
      </a>
      <UiLabel v-if="!pool.metadata.finalized" v-text="pool.getTypeStr()" />
      <h3 v-text="_num(pool.getBptPrice(), 'usd-long')" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['pool']
};
</script>
