<template>
  <div id="app" class="overflow-hidden">
    <VueLoadingIndicator
      v-if="settings.loading || !settings.init"
      class="overlay big"
    />
    <div v-else>
      <Topnav />
      <div class="d-flex flex-row">
        <Sidebar />
        <router-view class="flex-auto p-5" style="margin: 80px 0 0 264px;" />
      </div>
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
