<template>
  <Modal :open="open" @close="$emit('close')">
    <div class="modal-body p-7 text-left" v-if="pool.id">
      <h2 class="mb-6 text-center">Remove liquidity</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="poolAmountIn">
            Amount (max:
            <a @click="poolAmountIn = poolTokenBalance">
              {{ $n(poolTokenBalance) }}</a
            >)
          </label>
          <input
            id="poolAmountIn"
            v-model="poolAmountIn"
            type="number"
            step="any"
            class="h1 width-full border-0 form-control"
            :class="{ 'text-red': parseFloat(poolAmountIn) > poolTokenBalance }"
            placeholder="0.0"
          />
        </div>
        <div class="mb-4">
          <label>Withdraw</label>
          <div
            v-for="token in pool.tokens"
            :key="token.address"
            class="d-flex border-bottom py-2"
          >
            <Token :address="token.address" class="mr-2 flex-auto" />
            <div class="my-2">
              {{ $n((token.balance / pool.totalShares) * poolAmountIn) }}
              {{ token.symbol }}
            </div>
          </div>
          <div class="d-flex py-2">
            <div class="my-2 flex-auto">Total value</div>
            <div class="my-2">$0</div>
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

export default {
  props: ['open', 'pool'],
  data() {
    return {
      poolAmountIn: '',
      poolTokenBalance: 0
    };
  },
  watch: {
    pool() {
      if (!this.settings.address) return;
      const myShares = this.pool.shares.filter(
        share => share.userAddress.id === this.settings.address.toLowerCase()
      );
      this.poolTokenBalance = myShares[0] ? myShares[0].balance : 0;
    }
  },
  methods: {
    ...mapActions(['exitPool']),
    handleSubmit() {
      this.exitPool({
        poolAddress: this.pool.id,
        poolAmountIn: this.poolAmountIn,
        minAmountsOut: this.pool.tokens.map(() => 0)
      });
    }
  }
};
</script>
