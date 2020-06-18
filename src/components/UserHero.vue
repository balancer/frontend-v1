<template>
  <nav id="menu" class="mb-3">
    <div class="bg-blue mosaic rounded-lg-2 mx-lg-4 py-8">
      <Container v-if="provider.account">
        <h1 class="text-white text-center text-md-left flex-auto">
          {{ provider.account | shorten }}
        </h1>
      </Container>
    </div>
    <Container>
      <X />
    </Container>
  </nav>
</template>

<script>
export default {};
</script>
