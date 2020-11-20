<template>
  <button
    @click="handleClick"
    :disabled="isDisabled"
    type="button"
    class="button"
  >
    <UiLoading v-if="step === 'loading'" />
    <span v-else-if="step === 'login'" v-text="'Connect wallet'" />
    <span v-else-if="step === 'proxy'" v-text="'Setup proxy'" />
    <span
      v-else-if="step === 'approval'"
      v-text="`Unlock ${nextRequiredApproval.symbol}`"
    />
    <slot v-else />
  </button>
</template>

<script>
import { mapActions } from 'vuex';
import { bnum } from '@/helpers/utils';

export default {
  props: {
    disabled: !Boolean,
    loading: !Boolean,
    requireLogin: !Boolean,
    requireProxy: !Boolean,
    requireApprovals: !Object
  },
  data() {
    return {
      isLoading: false
    };
  },
  watch: {
    requireApprovals(value, oldValue) {
      if (
        JSON.stringify(Object.keys(value)) !==
        JSON.stringify(Object.keys(oldValue))
      ) {
        this.getAllowances(Object.keys(value));
      }
    }
  },
  computed: {
    step() {
      if (this.loading || this.isLoading) return 'loading';
      if (this.requireLogin && !this.$auth.isAuthenticated) return 'login';
      if (this.requireProxy && !this.web3.dsProxyAddress) return 'proxy';
      if (this.requireApprovals && this.nextRequiredApproval) return 'approval';
      if (this.disabled) return false;
      return false;
    },
    isDisabled() {
      return this.disabled || this.step === 'loading';
    },
    nextRequiredApproval() {
      if (!this.requireApprovals) return false;
      const allowances = Object.fromEntries(
        Object.entries(this.web3.allowances).map(allowance => [
          allowance[0],
          allowance[1][this.web3.dsProxyAddress]
        ])
      );
      let nextRequiredApproval = false;
      Object.entries(this.requireApprovals).forEach(requiredApproval => {
        console.log(requiredApproval[1], allowances[requiredApproval[0]]);
        const token = this.web3.tokenMetadata[requiredApproval[0]];
        const requiredAmount = bnum(requiredApproval[1]).times(token.decimals);
        if (
          token &&
          nextRequiredApproval === false &&
          (!allowances[requiredApproval[0]] ||
            requiredAmount.gt(bnum(allowances[requiredApproval[0]])))
        ) {
          console.log(requiredAmount, allowances[requiredApproval[0]]);
          nextRequiredApproval = {
            address: requiredApproval[0],
            symbol: token
              ? this._shorten(token.symbol, 14)
              : this._shortenAddress(requiredApproval[0]),
            amount: requiredApproval[1]
          };
        }
      });
      return nextRequiredApproval;
    }
  },
  methods: {
    ...mapActions(['createProxy', 'getAllowances', 'approve']),
    async handleClick() {
      if (this.step === 'proxy') return this.handleCreateProxy();
      if (this.step === 'approval') return this.handleApprove();
      if (!this.step) return this.$emit('submit');
    },
    async handleCreateProxy() {
      this.isLoading = true;
      try {
        await this.createProxy();
      } catch (e) {
        console.error(e);
      }
      this.isLoading = false;
    },
    async handleApprove() {
      this.isLoading = true;
      try {
        await this.approve(this.nextRequiredApproval.address);
        await this.getAllowances([this.nextRequiredApproval.address]);
      } catch (e) {
        console.error(e);
      }
      this.isLoading = false;
    }
  }
};
</script>
