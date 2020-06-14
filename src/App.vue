<template>
  <div id="app" class="overflow-hidden pb-6 bg-blue-light">
    <VueLoadingIndicator
      v-if="settings.loading || !settings.init"
      class="overlay big bg-blue-light"
    />
    <div v-else>
      <Nav />
      <router-view :key="$route.path" />
    </div>
    <Notifications />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(['init'])
  },
  mounted() {
    this.init();
  }
};
</script>
