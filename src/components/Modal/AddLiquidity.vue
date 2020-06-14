<template>
  <Modal :open="open" @close="$emit('close')">
    <div class="modal-body p-7 text-left" v-if="pool.id">
      <h2 class="mb-6 text-center">Add liquidity</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label>Input</label>
          <div
            v-for="token in pool.tokens"
            :key="token.address"
            class="d-flex border-bottom py-2"
          >
            <div class="flex-auto">
              <input
                v-model="amounts[token.address]"
                type="number"
                step="any"
                class="h2 border-0 form-control mr-2"
                placeholder="0.0"
                @keyup="handleChange(amounts[token.address], token)"
              />
            </div>
            <div class="d-flex mt-1">
              <Token :address="token.address" class="mr-2" />
              <span class="my-2">{{ token.symbol }}</span>
            </div>
          </div>
          <div class="d-flex py-2">
            <div class="my-2 flex-auto">Total value</div>
            <div class="my-2">$0</div>
          </div>
        </div>
        <div class="mb-4">
          <label>Output</label>
          <div class="d-flex">
            <div class="h2 my-2 flex-auto">{{ $n(poolTokens) }}</div>
            <div class="d-flex mt-1">
              <Token :address="poolAddress" symbol="BPT" class="mr-2" />
              <span class="my-2">BPT</span>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <div class="col-6 float-left pr-2">
            <button
              type="submit"
              class="btn-outline width-full"
              @click="$emit('close')"
            >
              Cancel
            </button>
          </div>
          <div class="col-6 float-left pl-2">
            <button type="submit" class="btn-mktg width-full">Confirm</button>
          </div>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script>
import { mapActions } from 'vuex';
import { getAddress } from 'ethers/utils';
import { MAX_UINT } from '@/helpers/utils';

export default {
  props: ['open', 'pool'],
  data() {
    return {
      poolTokens: '0',
      amounts: {}
    };
  },
  computed: {
    poolAddress() {
      return getAddress(this.pool.id);
    }
  },
  methods: {
    ...mapActions(['joinPool']),
    handleChange(changedAmount, changedToken) {
      const ratio = changedAmount / changedToken.balance;
      this.poolTokens = ratio * this.pool.totalShares;
      this.pool.tokens.forEach(token => {
        if (token.address !== changedToken) {
          this.amounts[token.address] = ratio * token.balance;
        }
      });
    },
    handleSubmit() {
      this.joinPool({
        poolAddress: this.pool.id,
        poolAmountOut: this.poolTokens,
        maxAmountsIn: this.pool.tokens.map(() => MAX_UINT.toString())
      });
    }
  }
};
</script>
