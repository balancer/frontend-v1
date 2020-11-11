<template>
  <div id="app" class="overflow-hidden">
    <UiLoading v-if="ui.loading || !ui.init" class="overlay big" />
    <div v-else>
      <Topnav />
      <div
        class="d-flex flex-row pb-6"
        :style="ui.sidebarIsOpen && 'max-height: 100vh'"
      >
        <div
          class="shell d-block d-xl-none"
          :class="ui.sidebarIsOpen && 'sidebar-is-open'"
          @click="toggleSidebar"
        />
        <Sidebar :key="$router.currentRoute.fullPath" />
        <router-view id="view" class="flex-auto" />
      </div>
      <Notifications />
      <portal-target name="modal" multiple />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { pageView } from '@/helpers/fathom';

export default {
  watch: {
    $route() {
      pageView();
      this.hideSidebar();
    },
    'ui.modalOpen': function(val) {
      const el = document.body;
      el.classList[val ? 'add' : 'remove']('overflow-hidden');
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

#view {
  margin-left: 0;
  margin-top: 80px;

  @media (min-width: $width-xl) {
    margin-left: 264px;
  }
}

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
