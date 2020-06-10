<template>
  <div class="border-top">
    <Container class="pt-4 text-center">
      <h1 class="mb-6">Create a pool</h1>
      <div class="mb-8 mx-auto overflow-hidden" style="width: 460px;">
        <div class="col-6 float-left">
          <router-link
            :to="{ name: 'create-shared-pool' }"
            class="d-block mr-2 bg-white p-4 rounded-2 border"
            style="height: 230px;"
          >
            <h3 class="mb-2 mt-6">Shared pool</h3>
            <p>Lorem ipsum dolor sit amet, consectetur</p>
          </router-link>
        </div>
        <div class="col-6 float-left">
          <div
            class="ml-2 bg-white p-4 rounded-2 border"
            style="height: 230px;"
          >
            <h3 class="mb-2 mt-6">Smart pool</h3>
            <p>Sed do eiusmod tempor incididunt ut</p>
          </div>
        </div>
      </div>
      <button class="btn-mktg">Continue</button>
    </Container>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  path: '/pool/new',
  computed: {
    ...mapState(['settings'])
  }
};
</script>
