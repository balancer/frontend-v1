<template>
  <VueSwitch v-model="isUnlocked" @click="handleSubmit" />
</template>

<script>
import { mapActions } from 'vuex';
import { getAddress } from 'ethers/utils';

export default {
  props: ['tokenAddress', 'spender', 'value'],
  data() {
    return {
      isUnlocked: false
    };
  },
  watch: {
    async approval() {
      await this.init();
    }
  },
  computed: {
    approval() {
      try {
        return this.allowances.approvals[this.tokenAddress];
      } catch (e) {
        return '';
      }
    }
  },
  methods: {
    ...mapActions(['approve', 'getAllowance']),
    handleSubmit() {
      this.approve({
        tokenAddress: getAddress(this.tokenAddress),
        spender: this.spender
      });
    },
    async init() {
      await this.getAllowance({
        tokenAddress: getAddress(this.tokenAddress),
        spender: this.spender
      });
    }
  },
  async created() {
    await this.init();
  }
};
</script>
