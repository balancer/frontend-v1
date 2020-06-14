<template>
  <div v-if="open" class="modal">
    <div class="backdrop" @click="$emit('close')" />
    <div class="shell overflow-hidden anim-scale-in position-relative">
      <a
        v-if="closeButton"
        @click="$emit('close')"
        class="position-absolute iconfont iconclose right-3 top-3 p-2"
      />
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ['open', 'closeButton']
};
</script>

<style scoped lang="scss">
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
    max-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    z-index: 999;
    margin: 0 auto;
    width: 100%;

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
