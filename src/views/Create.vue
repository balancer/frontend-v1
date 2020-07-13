<template>
  <div class="px-0 px-md-5 py-4">
    <h3 class="mb-4 px-4 px-md-0">Create a Pool</h3>
    <div class="float-left col-12 col-md-6 col-lg-4 pr-md-3 mb-2">
      <div class="p-4 panel-background border rounded-1 d-flex flex-column">
        <h2 class="mb-3 text-white">Shared Pool</h2>
        <div class="flex-auto">
          <div class="mb-2 text-white">
            On a shared pool all the parameters are set once and for ever.
          </div>
          <div class="mb-4">
            <a target="_blank">
              Learn more
              <Icon name="external-link" size="16" class="ml-1" />
            </a>
          </div>
        </div>
        <div>
          <UiButton @click="openModal">Create Shared Pool</UiButton>
        </div>
      </div>
    </div>
    <ModalCreatePool :open="modalOpen" @close="modalOpen = false" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalOpen: false
    };
  },
  methods: {
    openModal() {
      if (!this.hasProxy) {
        return this.$router.push({ name: 'setup' });
      }
      this.modalOpen = true;
    }
  }
};
</script>
