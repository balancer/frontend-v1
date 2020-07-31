<template>
  <div id="app" class="overflow-hidden">
    <VueLoadingIndicator v-if="ui.loading || !ui.init" class="overlay big" />
    <div v-else>
      <Topnav />
      <div style="margin-top: 80px;">
        <router-view class="pt-4" />
      </div>
    </div>
    <Notifications />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  watch: {
    $route() {
      this.hideSidebar();
    }
  },
  methods: {
    ...mapActions(['init', 'toggleSidebar', 'hideSidebar'])
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
@import './vars';

.shell {
  &.sidebar-is-open {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
