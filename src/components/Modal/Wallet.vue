<template>
  <UiModal :open="open" @close="$emit('close')" class="side-modal">
    <h3 v-text="$t('myWallet')" class="p-4 border-bottom text-center" />
    <div v-if="side !== 0">
      <a @click="side = 0" class="d-inline-block px-4 pt-4 pb-2">
        <Icon name="back" size="22" class="v-align-middle" />
        Back
      </a>
      <FormWrapper :side="side" @close="side = 0" />
    </div>
    <div v-else class="modal-body">
      <Block class="m-4 py-4 text-center position-relative">
        <a
          :href="_etherscanLink(web3.account)"
          target="_blank"
          class="position-absolute right-2 top-3"
        >
          <Icon name="external-link" size="16" class="ml-1 mr-2" />
        </a>
        <h3 v-text="_num(balancesTotalValue, 'usd-long')" />
        {{ $t('totalValue') }}
      </Block>
      <Block :slim="true" class="m-4">
        <div class="d-flex p-3">
          <div v-text="'Asset'" class="flex-auto" />
          <div v-text="'Holdings'" class="column text-right" />
        </div>
        <div
          v-for="(balance, i) in balances"
          :key="i"
          class="d-flex p-3 border-top"
        >
          <div>
            <Token :address="balance.address" class="mr-3" size="32" />
          </div>
          <div class="text-left">
            <div v-text="balance.name" class="text-white" />
            <div v-text="balance.symbol" />
          </div>
          <div class="flex-auto">
            <div
              v-if="balance.address !== 'ether'"
              class="flex-auto float-right"
            >
              <UiButton
                v-if="balance.address === config.addresses.weth"
                @click="side = 2"
                type="button"
                class="button-primary button-sm ml-2"
              >
                Unwrap
              </UiButton>
            </div>
            <div v-else class="flex-auto float-right">
              <UiButton
                @click="side = 1"
                type="button"
                class="button-primary button-sm ml-2"
              >
                Wrap
              </UiButton>
            </div>
          </div>
          <div class="column text-right">
            <div class="text-white">
              {{ _num(balance.balance, 'long') }}
              {{ balance.symbol }}
            </div>
            <div v-text="_num(balance.value, 'usd-long')" class="text-gray" />
          </div>
        </div>
      </Block>
    </div>
  </UiModal>
</template>

<script>
import { formatUnits } from '@ethersproject/units';

export default {
  props: {
    open: Boolean
  },
  data() {
    return {
      modalWrapperOpen: false,
      side: 0
    };
  },
  watch: {
    open() {
      this.side = 0;
    }
  },
  computed: {
    balances() {
      const balances = Object.entries(this.web3.balances)
        .filter(
          ([address]) => address !== 'ether' && this.web3.tokenMetadata[address]
        )
        .map(([address, denormBalance]) => {
          const price = this.price.values[address];
          const balance = formatUnits(
            denormBalance,
            this.web3.tokenMetadata[address].decimals
          );
          return {
            address,
            name: this.web3.tokenMetadata[address].name,
            symbol: this.web3.tokenMetadata[address].symbol,
            price,
            balance,
            value: balance * price
          };
        })
        .filter(({ value }) => value > 0.001);
      const ethPrice = this.price.values[this.config.addresses.weth];
      const ethBalance = formatUnits(this.web3.balances['ether'] || 0, 18);
      return [
        {
          address: 'ether',
          name: 'ETH',
          symbol: 'ETH',
          price: ethPrice,
          balance: ethBalance,
          value: ethPrice * ethBalance
        },
        ...balances
      ];
    },
    balancesTotalValue() {
      return this.balances.reduce((a, b) => a + b.value, 0);
    }
  }
};
</script>
