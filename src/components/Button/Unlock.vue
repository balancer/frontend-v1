<template>
  <a v-if="!approval" @click="handleSubmit">
    <Icon name="unlock" class="ml-n2 mr-1 v-align-middle" />
    Unlock {{ approval }}
  </a>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['tokenAddress', 'spender', 'value'],
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
        tokenAddress: this.tokenAddress,
        spender: this.spender
      });
    },
    async init() {
      await this.getAllowance({
        tokenAddress: this.tokenAddress,
        spender: this.spender
      });
    }
  },
  async created() {
    await this.init();
  }
};
</script>
