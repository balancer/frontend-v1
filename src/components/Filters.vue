<template>
  <div :key="JSON.stringify(input)" class="d-flex flex-items-center">
    <div class="pb-1">Filter by asset</div>
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
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      input: {},
      tokens: [],
      modalOpen: false
    };
  },
  methods: {
    addToken(token) {
      this.tokens.push(token);
      this.$emit('input', { token: this.tokens });
    },
    deleteToken(i) {
      delete this.tokens[i];
      this.tokens = this.tokens.filter(() => true);
      this.$emit('input', { token: this.tokens });
    }
  },
  created() {
    const tokens = Array.isArray(this.value.token)
      ? this.value.token
      : [this.value.token];
    this.tokens = this.value.token ? tokens : [];
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
