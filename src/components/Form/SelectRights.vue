<template>
  <div>
    <div class="px-4 mb-4 overflow-hidden">
      <h2 class="mb-3">Select right(s)</h2>
      <p class="mb-3">Venenatis urna cursus eget nunc scelerisque viverra.</p>
    </div>
    <div
      class="text-left mb-7 mx-6 overflow-hidden border border-bottom-0 rounded-2"
    >
      <a
        v-for="(right, i) in rights"
        :key="i"
        @click="switchRight(i)"
        class="border-bottom p-3 d-block text-normal"
      >
        <Icon
          name="check"
          class="check v-align-middle mr-2"
          :class="{ 'text-blue': rights[i] }"
          size="28"
        />
        <span class="text-gray">{{ makeTitle(i) }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import { capitalize, startCase } from 'lodash';

export default {
  data() {
    return {
      rights: {
        pausableSwap: true,
        configurableSwapFee: true,
        configurableWeights: true,
        configurableAddRemoveTokens: true
      }
    };
  },
  methods: {
    makeTitle(str) {
      return capitalize(startCase(str).toLowerCase());
    },
    switchRight(right) {
      this.rights[right] = !this.rights[right];
    }
  }
};
</script>
