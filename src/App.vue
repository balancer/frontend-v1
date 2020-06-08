<template>
  <div id="app" class="overflow-hidden pb-6 bg-blue-light">
    <VueLoadingIndicator
      v-if="settings.loading"
      class="overlay big bg-blue-light"
    />
    <div v-else>
      <Nav />
      <router-view :key="$route.path" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['settings'])
  },
  methods: {
    ...mapActions(['init'])
  },
  async created() {
    this.init();
  }
};
</script>
