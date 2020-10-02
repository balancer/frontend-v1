<template>
  <div class="d-flex">
    <div class="mr-2 pr-1">
      <Token :address="pool.getBptAddress()" size="44" />
    </div>
    <div>
      <div>
        <h3>
          <span
            class="mr-2"
            v-if="pool.config.name || pool.metadata.name"
            v-text="_shorten(pool.config.name || pool.metadata.name, 24)"
          />
          <span class="mr-2" v-else
            >Pool {{ _shortenAddress(pool.address) }}</span
          >
          <UiLabel v-if="!pool.metadata.finalized" v-text="pool.getTypeStr()" />
        </h3>
        <a :href="_etherscanLink(pool.getBptAddress())" target="_blank">
          <span
            v-if="pool.config.symbol || pool.metadata.symbol"
            v-text="_shorten(pool.config.symbol || pool.metadata.symbol)"
          />
          <Icon name="external-link" size="16" class="ml-1 mr-2" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['pool']
};
</script>
