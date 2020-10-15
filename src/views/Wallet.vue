<template>
  <Page>
    <Container class="d-flex flex-items-center mb-3">
      <h3 v-text="$t('myWallet')" class="flex-auto" />
    </Container>
    <UiTable>
      <UiTableTh>
        <div v-text="'Asset'" class="flex-auto text-left" />
        <div v-text="'Balance'" class="column" />
        <div v-text="'Value'" class="column" />
      </UiTableTh>
      <UiTableTr v-for="(balance, i) in balances" :key="i">
        <Token :address="i" class="mr-3" size="32" />
        <div class="flex-auto text-left">
          <div v-if="i !== 'ether'" class="flex-auto">
            {{ _ticker(i) }}
            <UiButton
              v-if="i === config.addresses.weth"
              @click="modalWrapperOpen = true"
              type="button"
              class="button-primary button-sm ml-2"
            >
              Unwrap to ETH
            </UiButton>
          </div>
          <div v-else class="flex-auto">
            ETH
            <UiButton
              @click="modalWrapperOpen = true"
              type="button"
              class="button-primary button-sm ml-2"
            >
              Wrap to WETH
            </UiButton>
          </div>
        </div>
        <div v-text="_num(formatBalance(balance, i))" class="column" />
        <div
          v-text="_num(getTokenValue([i, balance]), 'currency')"
          class="column"
        />
      </UiTableTr>
    </UiTable>
    <ModalWrapper :open="modalWrapperOpen" @close="modalWrapperOpen = false" />
  </Page>
</template>

<script>
import { clone, normalizeBalance } from '@/helpers/utils';
import config from '@/config';

export default {
  data() {
    return {
      modalWrapperOpen: false
    };
  },
  computed: {
    balances() {
      const balances = Object.fromEntries(
        Object.entries(clone(this.web3.balances))
          .filter(entry => this.getTokenValue(entry) > 0.001)
          .sort((a, b) => {
            const aValue = this.getTokenValue(a);
            const bValue = this.getTokenValue(b);
            return bValue - aValue;
          })
      );
      const target = { ether: balances.ether };
      target[config.addresses.weth] = balances[config.addresses.weth];
      return Object.assign(target, balances);
    }
  },
  methods: {
    getTokenValue([address, balanceStr]) {
      if (!this.web3.tokenMetadata[address] && address !== 'ether') return 0;
      const decimals =
        address === 'ether' ? 18 : this.web3.tokenMetadata[address].decimals;
      const balance = normalizeBalance(balanceStr, decimals);
      const weth = this.config.tokens[this.config.addresses.weth];
      const price =
        address === 'ether'
          ? this.price.values[weth.address]
          : this.price.values[address];
      return balance.times(price).toNumber();
    },
    formatBalance(balanceString, address) {
      const decimals =
        address === 'ether' ? 18 : this.web3.tokenMetadata[address].decimals;
      const rawBalance = normalizeBalance(balanceString || '0', decimals);
      return this._precision(rawBalance.toNumber(), address);
    }
  }
};
</script>
