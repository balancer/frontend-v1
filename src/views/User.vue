<template>
  <div>
    <UserHero :address="address" :name="name" :profile="profile" />
    <VueLoadingIndicator v-if="loading" class="big py-4" />
    <Container class="d-flex" v-else>
      <div style="margin-left: 200px;">
        <p>Today</p>
        <p>Yesterday</p>
        <p>...</p>
      </div>
    </Container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { isValidAddress } from '@/helpers/utils';

export default {
  name: 'user',
  path: ['/:id', '/:id/about'],
  data() {
    return {
      loading: false,
      id: this.$router.currentRoute.params.id,
      name: null,
      address: null,
      profile: {}
    };
  },
  methods: {
    ...mapActions(['lookupAddress', 'resolveName', 'getProfile'])
  },
  async created() {
    this.loading = true;
    if (isValidAddress(this.id)) {
      this.name = await this.lookupAddress(this.id);
      this.address = this.id;
    } else {
      this.name = this.id;
      this.address = await this.resolveName(this.id);
    }
    this.profile = await this.getProfile(this.address);
    this.loading = false;
  }
};
</script>
