<template>
  <button :class="{ active }" @click="toggleFavorite(id)">
    <Icon :name="active ? 'favorite-on' : 'favorite-off'" size="22" />
  </button>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    id: String
  },
  computed: {
    active() {
      return !!(this.favorite.favorites && this.favorite.favorites[this.id]);
    }
  },
  methods: {
    ...mapActions(['addFavorite', 'removeFavorite']),
    toggleFavorite(id) {
      if (this.favorite.favorites[id]) {
        this.removeFavorite(id);
      } else {
        this.addFavorite(id);
      }
    }
  }
};
</script>

<style lang="scss">
@import '../vars';

button {
  z-index: 999999;
  border: 0;
  padding: 0;
  color: $text-gray;
  background: transparent;
}
</style>
