<template>
  <div>
    <Hero />
    <NavMain />
    <Container>
      <div class="float-left col-12 col-md-6 col-lg-4 pr-md-3 mb-3">
        <div
          class="p-4 bg-black rounded-2 d-flex flex-column"
          style="height: 300px;"
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
            <a class="btn-white text-black">Create shared pool</a>
          </div>
        </div>
      </div>
      <div class="float-left col-12 col-md-6 col-lg-4 pr-md-3 mb-2">
        <div
          class="p-4 bg-blue rounded-2 d-flex flex-column"
          style="height: 300px;"
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
            <a @click="modalOpen = true" class="btn-white">Create smart pool</a>
          </div>
        </div>
      </div>
    </Container>
    <ModalCreatePool :open="modalOpen" @close="modalOpen = false" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalOpen: false
    };
  }
};
</script>
