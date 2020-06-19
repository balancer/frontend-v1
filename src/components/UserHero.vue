<template>
  <div style="height: 256px;" class="mb-4">
    <div
      class="bg-black mosaic rounded-lg-2 mx-lg-4 py-8"
      style="height: 160px;"
      :style="coverStyle"
    >
      <div class="position-absolute left-0 right-0 mt-5">
        <Container>
          <div class="d-flex">
            <div style="width: 200px;" class="text-center">
              <img
                v-if="image"
                class="circle"
                style="width: 120px; height: 120px;"
                :src="image"
              />
              <Avatar :address="address" size="120" class="mr-4" v-else />
            </div>
            <div class="pt-2">
              <h1
                v-if="displayName"
                class="text-white text-center text-md-left flex-auto mb-4"
                v-text="displayName"
              />
              <h1 v-else>
                <span
                  class="bg-gray d-inline-block rounded-2 anim-pulse mb-3"
                  style="height: 37px; width: 120px;"
                />
              </h1>
              <Nav
                :items="[
                  { name: 'Activity', to: { name: 'user' } },
                  { name: 'About', to: { name: 'user-1' } }
                ]"
              />
            </div>
          </div>
        </Container>
      </div>
    </div>
  </div>
</template>

<script>
import shorten from '@/helpers/utils';

export default {
  props: ['address', 'name', 'profile'],
  computed: {
    displayName() {
      try {
        return this.profile.name;
      } catch (e) {
        return this.name || shorten(this.address);
      }
    },
    image() {
      try {
        return `https://ipfs.infura.io/ipfs/${this.profile.image[0].contentUrl['/']}`;
      } catch (e) {
        return null;
      }
    },
    coverStyle() {
      let coverStyle = {};
      try {
        const src = `url("https://ipfs.infura.io/ipfs/${this.profile.coverPhoto[0].contentUrl['/']}")`;
        coverStyle = {
          backgroundImage: src,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
        return coverStyle;
      } catch (e) {
        return {};
      }
    }
  }
};
</script>
