<template>
  <div id="app">
    <UiLoading v-if="app.loading || !app.init" class="overlay big" />
    <div v-else>
      <Topnav />
      <Notifications />
      <portal-target name="modal" multiple />
      <div class="pt-11 pb-6">
        <router-view id="view" />
      </div>
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
    },
    'app.modalOpen': function(val) {
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
