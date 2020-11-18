<template>
  <div v-if="open" class="modal mx-auto">
    <div class="backdrop" @click="$emit('close')" />
    <div class="shell overflow-hidden position-relative rounded-2">
      <slot />
      <a @click="$emit('close')" class="position-absolute right-0 p-4">
        <Icon name="close" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    open: Boolean
  },
  watch: {
    open(val, prev) {
      if (val !== prev) this.toggleModal();
    }
  },
  methods: {
    ...mapActions(['toggleModal'])
  }
};
</script>

<style lang="scss">
@import '../../vars';

.modal {
  position: fixed;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  z-index: 10;
  @extend .anim-scale-in !optional;

  &.side-modal {
    .shell {
      position: fixed !important;
      bottom: 0;
      right: 0;
      top: 0;
      width: 100%;
      max-width: 480px;
      max-height: 100vh;
      border-radius: 0 !important;
      border-top: 0 !important;
      border-bottom: 0 !important;
      border-right: 0 !important;
    }
  }

  .backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.4);
  }

  .shell {
    display: flex;
    flex-direction: column;
    z-index: 999;
    margin: 0 auto;
    width: 100%;
    max-height: 90%;

    @media (max-width: 767px) {
      width: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      min-height: 100% !important;
      margin-bottom: 0 !important;
    }

    .modal-body {
      text-align: initial;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}
</style>
