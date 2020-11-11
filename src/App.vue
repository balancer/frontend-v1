<template>
  <div id="app" class="overflow-hidden">
    <UiLoading v-if="ui.loading || !ui.init" class="overlay big" />
    <div v-else>
      <Topnav />
      <div class="pt-10">
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
    },
    'ui.modalOpen': function(val) {
      const el = document.body;
      el.classList[val ? 'add' : 'remove']('overflow-hidden');
    }
  },
  methods: {
    ...mapActions(['init'])
  },
  mounted() {
    this.init();
  }
};
</script>
