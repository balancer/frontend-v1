<template>
  <div class="px-0 px-md-5 py-4">
    <UiLoading
      v-if="loading || (requireLogin && ui.authLoading)"
      class="big py-3"
    />
    <Container v-else-if="requireLogin && !$auth.isAuthenticated" :slim="true">
      <Block class="p-4 text-center">
        <h4>You need to be connected to see this page.</h4>
      </Block>
    </Container>
    <slot v-else />
  </div>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    requireLogin: Boolean
  }
};
</script>
