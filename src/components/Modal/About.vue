<template>
  <UiModal :open="open" @close="$emit('close')">
    <div class="modal-body my-5 px-4 text-left">
      <h2 class="mb-3 text-center">About</h2>
      <p
        v-if="pkg.description"
        style="font-size: 20px;"
        class="text-center mb-4"
      >
        {{ pkg.description }}
      </p>
      <p v-if="pkg.bugs && pkg.bugs.url">
        <label class="d-block">GitHub</label>
        <a :href="pkg.bugs.url.replace('/issues', '')" target="_blank">
          {{ pkg.bugs.url.replace('/issues', '') }}
          <Icon name="external-link" class="ml-1" size="18" />
        </a>
      </p>
      <p v-if="pkg.version && pkg.bugs">
        <label class="d-block">Version</label>
        <a
          :href="pkg.bugs.url.replace('/issues', '/blob/master/package.json')"
          target="_blank"
        >
          {{ pkg.version }}
          <Icon name="external-link" class="ml-1" size="18" />
        </a>
      </p>
      <p v-if="pkg.license">
        <label class="d-block">License</label>
        <a
          :href="pkg.bugs.url.replace('/issues', '/blob/master/LICENSE')"
          target="_blank"
        >
          {{ pkg.license }}
          <Icon name="external-link" class="ml-1" size="18" />
        </a>
      </p>
    </div>
  </UiModal>
</template>

<script>
import pkg from '@/../package.json';

export default {
  props: ['open'],
  data() {
    return {
      pkg
    };
  }
};
</script>
