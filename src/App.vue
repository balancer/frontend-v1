<template>
  <div id="app" class="overflow-hidden">
    <UiLoading v-if="ui.loading || !ui.init" class="overlay big" />
    <div v-else>
      <Topnav :key="$router.currentRoute.name" />
      <div class="pt-9 pb-4">
        <Sidenav :key="$router.currentRoute.name" />
        <router-view class="flex-auto" />
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
      this.hideSidenav();
    },
    'ui.modalOpen': function(val) {
      const el = document.body;
      el.classList[val ? 'add' : 'remove']('overflow-hidden');
    }
  },
  methods: {
    ...mapActions(['init', 'hideSidenav'])
  },
  mounted() {
    this.init();
  }
};
</script>
