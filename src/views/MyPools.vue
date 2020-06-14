<template>
  <div>
    <Menu />
    <Container class="my-6">
      <p class="mb-4 text-normal">
        Look like you haven't created any pool yet.
      </p>
      <a @click="modalOpen = true" class="btn-mktg">Create a pool</a>
    </Container>
    <ModalCreatePool :open="modalOpen" @close="modalOpen = false" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalOpen: false
    };
  }
};
</script>
