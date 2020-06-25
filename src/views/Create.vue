<template>
  <div class="px-0 px-md-5 py-4">
    <h3 class="mb-4 px-4 px-md-0">Create a pool</h3>
    <div class="float-left col-12 col-md-6 col-lg-4 pr-md-3 mb-3">
      <div
        class="p-4 panel-background border rounded-1 d-flex flex-column"
        style="height: 240px;"
      >
        <h3 class="mb-3 text-white">Shared pool</h3>
        <div class="flex-auto">
          <p class="mb-2 text-white">
            Enim eu turpis egestas pretium aenean pharetra magna. Facilisis
            gravida neque convallis a.
          </p>
          <p class="mb-3">
            <a target="_blank">
              Learn more
              <Icon name="external-link" size="16" class="ml-1" />
            </a>
          </p>
        </div>
        <div>
          <Button>Create shared pool</Button>
        </div>
      </div>
    </div>
    <div class="float-left col-12 col-md-6 col-lg-4 pr-md-3 mb-2">
      <div
        class="p-4 panel-background border rounded-1 d-flex flex-column"
        style="height: 240px;"
      >
        <h3 class="mb-3 text-white">Smart pool</h3>
        <div class="flex-auto">
          <p class="mb-2 text-white">
            Morbi tristique senectus et netus et malesuada fames. Erat nam at
            lectus urna.
          </p>
          <p class="mb-3">
            <a target="_blank">
              Learn more
              <Icon name="external-link" size="16" class="ml-1" />
            </a>
          </p>
        </div>
        <div>
          <Button @click="modalOpen = true">Create smart pool</Button>
        </div>
      </div>
    </div>
    <ModalCreatePool :open="modalOpen" @close="modalOpen = false" />
  </div>
</template>

<script>
import Button from '@/components/Button';
export default {
  components: { Button },
  data() {
    return {
      modalOpen: false
    };
  }
};
</script>
