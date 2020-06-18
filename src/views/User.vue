<template>
  <div>
    <Hero :title="profile.name || '/' " />
    <Container>
      <Nav
        :items="[
          { name: 'Profile', to: { name: 'user' } },
          { name: 'Timeline', to: { name: 'private' } }
        ]"
      />
    </Container>
  </div>
</template>

<script>
import { getProfile } from '3box';

export default {
  path: '/:id',
  data() {
    return {
      id: this.$router.currentRoute.params.id,
      profile: {}
    };
  },
  async created() {
    this.profile = await getProfile(this.id);
  }
};
</script>
