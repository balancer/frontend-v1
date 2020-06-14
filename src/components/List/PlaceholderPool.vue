<template>
  <div>
    <div
      v-for="i in 3"
      :key="i"
      class="py-4 border-bottom d-flex text-center v-align-middle"
      :style="`line-height: 0; opacity: ${1 - (i - 1) / 4};`"
    >
      <div class="flex-auto text-left">
        <span
          class="bg-gray d-inline-block rounded-2 anim-pulse"
          style="height: 38px; width: 40%;"
        />
      </div>
      <div class="hide-sm hide-md column">
        <span
          class="bg-gray d-inline-block rounded-2 anim-pulse"
          style="height: 38px; width: 64px;"
        />
      </div>
      <div class="hide-sm hide-md column">
        <span
          class="bg-gray d-inline-block rounded-2 anim-pulse"
          style="height: 38px; width: 64px;"
        />
      </div>
      <div class="hide-sm hide-md column">
        <span
          class="bg-gray d-inline-block rounded-2 anim-pulse"
          style="height: 38px; width: 64px;"
        />
      </div>
    </div>
  </div>
</template>
