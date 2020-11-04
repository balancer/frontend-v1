<template>
  <div v-if="open" class="modal mx-auto">
    <div class="backdrop anim-fade-in" @click="$emit('close')" />
    <div class="shell anim-fade-left">
      <slot />
      <a @click="$emit('close')" class="position-absolute right-0 p-4">
        <Icon name="close" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['open']
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

  .modal-body {
    flex: auto;
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
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: $panel-background;
    display: flex;
    flex-direction: column;
    z-index: 999;
    width: 100%;
    max-width: 480px;
    max-height: 100%;
    border-left: $border;

    @media (max-width: 767px) {
      border: none;
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
