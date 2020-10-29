<template>
  <div class="overflow-hidden">
    <Toggle
      :value="type"
      :options="poolTypes"
      @select="selectType"
      class="mb-4"
    />
    <div class="d-flex flex-items-center mb-4 pt-2 float-none float-sm-right">
      <div v-text="$t('filterByAsset')" class="pb-1" />
      <div v-for="(token, i) in tokens" :key="i" class="topic ml-2">
        <button
          class="topic-button text-center line-height-0 position-absolute right-0"
          @click="deleteToken(i)"
        >
          <Icon name="close" size="10" />
        </button>
        <span
          class="ml-2 pl-1"
          style="padding-right: 30px;"
          v-text="_ticker(token)"
        />
      </div>
      <div class="topic ml-2">
        <button @click="modalOpen = true" class="topic-button mb-1">
          <Icon name="plus" size="13" />
        </button>
      </div>
      <ModalSelectToken
        :open="modalOpen"
        @close="modalOpen = false"
        @input="addToken"
        :not="tokens"
      />
    </div>
  </div>
</template>

<script>
import { formatFilters } from '@/helpers/utils';

export default {
  props: ['value'],
  data() {
    return {
      input: {},
      tokens: [],
      type: 'shared',
      poolTypes: {
        shared: 'Shared',
        smart: 'Smart',
        private: 'Private'
      },
      modalOpen: false
    };
  },
  methods: {
    addToken(token) {
      this.tokens.push(token);
      this.$emit('input', {
        type: this.type,
        token: this.tokens
      });
    },
    deleteToken(i) {
      delete this.tokens[i];
      this.tokens = this.tokens.filter(() => true);
      this.$emit('input', {
        type: this.type,
        token: this.tokens
      });
    },
    selectType(poolType) {
      this.type = poolType;
      this.$emit('input', {
        type: this.type,
        token: this.tokens
      });
    }
  },
  created() {
    const filters = formatFilters(this.value);
    this.tokens = filters.token;
    this.type = filters.type;
  }
};
</script>

<style scoped lang="scss">
@import '../vars';

.topic {
  background-color: $blue-900;
  color: $white;
  border: 0;
  border-radius: 14px;
  line-height: 28px;
  height: 28px;
  position: relative;

  button:hover {
    background-color: $blue !important;
  }

  .topic-button {
    background-color: $blue-900;
    color: $white;
    border: 0;
    border-radius: 24px;
    padding: 0 6px;
    height: 28px;
    width: 28px;
  }
}
</style>
