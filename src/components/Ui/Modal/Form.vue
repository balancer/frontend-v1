<template>
  <form
    @submit.prevent="$emit('submit')"
    class="d-flex flex-column height-full"
  >
    <div v-if="$slots.header" class="border-bottom p-4">
      <slot name="header" />
    </div>
    <div class="modal-body flex-auto overflow-y-scroll">
      <slot />
    </div>
    <div v-if="$slots.footer" class="border-top p-4 text-center">
      <slot name="footer" />
    </div>
  </form>
</template>
