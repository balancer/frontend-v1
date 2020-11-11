<template>
  <div>
    Sort by
    <a
      @click="$emit('input', item)"
      v-for="(item, i) in items"
      :key="i"
      class="ml-2"
    >
      <Tag :class="item === value && 'active'">{{ item }}</Tag>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    value: String
  },
  computed: {
    items() {
      return ['volume', 'liquidity'];
    }
  }
};
</script>
