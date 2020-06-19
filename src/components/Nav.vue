<template>
  <nav class="nav mb-3">
    <ul class="list-style-none">
      <li v-for="(item, i) in items" :key="i" class="d-inline-block mr-4">
        <router-link :to="item.to">
          <div class="mb-3">
            {{ item.name }}
            <span
              v-if="item.count"
              v-text="$n(item.count)"
              class="counter ml-2"
            />
          </div>
          <span class="blob anim-grow-x" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ['items']
};
</script>
