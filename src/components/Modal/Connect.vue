<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm>
      <template slot="header">
        <h3>Connect wallet</h3>
      </template>
      <UiTable class="m-4">
        <a
          v-for="(connector, id, i) in connectors"
          :key="i"
          class="d-flex flex-items-center px-3 py-2"
          :class="i !== 0 && 'border-top'"
          @click="$emit('login', connector.id)"
        >
          <img
            :src="require(`@/assets/connectors/${connector.id}.svg`)"
            width="48"
            height="48"
            class="mr-3"
          />
          <h3 v-text="connector.name" />
        </a>
      </UiTable>
    </UiModalForm>
  </UiModal>
</template>

<script>
import config from '@/helpers/config';

export default {
  props: ['open'],
  data() {
    return {
      connectors: config.connectors
    };
  }
};
</script>
