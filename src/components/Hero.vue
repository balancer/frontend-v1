<template>
  <div class="bg-black mosaic rounded-lg-2 mx-lg-4 py-8">
    <Container>
      <h1
        class="text-white text-center text-md-left flex-auto"
        v-text="title || 'Your portfolio yielder'"
      />
    </Container>
  </div>
</template>

<script>
export default {
  props: ['title']
};
</script>
