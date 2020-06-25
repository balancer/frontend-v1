<template>
  <div>
    <div
      v-for="i in 3"
      :key="i"
      class="py-4 border-top d-flex text-right v-align-middle px-4"
      :style="`line-height: 0; opacity: ${1 - (i - 1) / 2.5};`"
    >
      <div class="column-sm text-left hide-sm hide-md hide-lg">
        <span
          class="bg-gray d-inline-block rounded-1 anim-pulse"
          style="height: 29px; width: 64px;"
        />
      </div>
      <div class="flex-auto text-left">
        <span
          class="bg-gray d-inline-block rounded-1 anim-pulse"
          style="height: 29px; width: 40%;"
        />
      </div>
      <div class="column hide-sm hide-md">
        <span
          class="bg-gray d-inline-block rounded-1 anim-pulse"
          style="height: 29px; width: 64px;"
        />
      </div>
      <div class="column">
        <span
          class="bg-gray d-inline-block rounded-1 anim-pulse"
          style="height: 29px; width: 64px;"
        />
      </div>
      <div class="column hide-sm hide-md">
        <span
          class="bg-gray d-inline-block rounded-1 anim-pulse"
          style="height: 29px; width: 64px;"
        />
      </div>
      <div class="column hide-sm hide-md hide-lg">
        <span
          class="bg-gray d-inline-block rounded-1 anim-pulse"
          style="height: 29px; width: 64px;"
        />
      </div>
    </div>
  </div>
</template>
