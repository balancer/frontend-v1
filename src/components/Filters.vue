<template>
  <div class="d-flex flex-items-center position-relative">
    Filter token(s)
    <div
      v-for="(token, i) in input"
      :key="i"
      class="topic topic-action f6 ml-2"
    >
      <button class="delete-topic-button right-0" @click="deleteToken(i)">
        ×
      </button>
      {{ _ticker(token) }}
    </div>
    <button @click="modalOpen = true" class="topic f6 ml-2">
      +
    </button>
    <ModalSelectToken
      :open="modalOpen"
      @close="modalOpen = false"
      @input="addToken"
      :not="input"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: [],
      modalOpen: false
    };
  },
  methods: {
    addToken(token) {
      this.input.push(token);
      this.$emit('input', this.input);
    },
    deleteToken(i) {
      delete this.input[i];
      this.input = this.input.filter(String);
      this.$emit('input', this.input);
    }
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
  padding: 0 10px;
  line-height: 28px;
  position: relative;

  &.topic-action {
    padding-right: 30px !important;
  }

  .delete-topic-button {
    position: absolute;
    background-color: $blue-900;
    color: $white;
    border: 0;
    border-radius: 24px;
    padding: 0 6px;
    line-height: 28px;
    width: 28px;

    &:hover {
      background-color: $blue;
    }
  }
}
</style>
