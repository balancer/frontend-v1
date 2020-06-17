<template>
  <div>
    <Menu />
    <Container>
      <div class="float-left col-12 col-md-4 pr-3 mb-3">
        <div
          class="p-4 bg-black rounded-2 d-flex flex-column"
          style="height: 300px;"
        >
          <h3 class="mb-3 text-white">Shared pool</h3>
          <div class="flex-auto">
            <p class="mb-3 text-white">
              Looks like you haven't created any pool yet, wanna give a try? Not
              sure what you doing?
              <a>Learn more</a>.
            </p>
          </div>
          <div>
            <a class="btn-white text-black">Create shared pool</a>
          </div>
        </div>
      </div>
      <div class="float-left col-12 col-md-4 pr-3 mb-2">
        <div
          class="p-4 bg-blue rounded-2 d-flex flex-column"
          style="height: 300px;"
        >
          <h3 class="mb-3 text-white">Smart pool</h3>
          <div class="flex-auto">
            <p class="mb-3 text-white">
              Looks like you haven't created any pool yet, wanna give a try? Not
              sure what you doing?
              <a>Learn more</a>.
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
