<template>
  <div id="app" class="overflow-hidden pb-6">
    <VueLoadingIndicator
      v-if="settings.loading || !settings.init"
      class="overlay big"
    />
    <div v-else>
      <NavTop />
      <router-view />
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
