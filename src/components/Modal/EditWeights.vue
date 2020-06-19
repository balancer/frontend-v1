<template>
  <Modal :open="open" @close="$emit('close')">
    <div
      class="modal-body py-6 text-center"
      :class="{ 'bg-blue mosaic anim-scroll': step > lastStep }"
    >
      <form @submit.prevent="handleSubmit">
        <div v-if="step === 0">
          <FormSelectWeights
            :tokens="tokens"
            v-model="weights"
            :value="value"
          />
          <div class="mx-3 overflow-hidden">
            <button
              type="button"
              class="btn-outline d-inline-block column mx-1"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              :disabled="
                loading ||
                  JSON.stringify(weights) === JSON.stringify(defaultValue)
              "
              type="submit"
              class="btn-mktg d-inline-block column mx-1"
            >
              Confirm
            </button>
          </div>
        </div>
        <FormBroadcast v-if="step === 1" @close="$emit('close')" />
      </form>
    </div>
  </Modal>
</template>

<script>
import { getAddress } from 'ethers/utils';
import { delay, clone } from '@/helpers/utils';

export default {
  props: ['open', 'pool'],
  data() {
    return {
      loading: false,
      step: 0,
      lastStep: 0,
      weights: []
    };
  },
  computed: {
    value() {
      const tokens = clone(this.pool.tokens);
      return tokens.map(token => token.denormWeight);
    },
    tokens() {
      const tokensList = clone(this.pool.tokensList);
      return tokensList.map(token => {
        console.log(token);
        return getAddress(token);
      });
    }
  },
  watch: {
    open() {
      this.step = 0;
      this.loading = false;
      this.weights = clone(this.value);
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      await delay(1e3);
      // @TODO Broadcast tx
      this.loading = false;
      this.step++;
    }
  }
};
</script>
