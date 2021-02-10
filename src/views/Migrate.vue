<template>
  <div class="page d-flex">
    <div class="migrate">
      <h3>Upgrade to V2</h3>
      <div class="mt-6">
        <PoolStripe
          :pool-v1="poolV1"
          :pool-v2="poolV2"
          :liquidity="liquidity"
        />
        <div class="stats d-flex flex-justify-between mt-4">
          <PoolStats
            :pool="poolV1"
            :is-v1="true"
            :details="poolStatDetails"
            @toggle-details="handleToggleStats"
          />
          <div class="arrow">→</div>
          <PoolStats
            :pool="poolV2"
            :is-v1="false"
            :details="poolStatDetails"
            @toggle-details="handleToggleStats"
          />
        </div>
        <div class="mt-4 d-flex flex-justify-center">
          <ButtonMigrate
            v-if="isUnlocked"
            :disabled="isDisabled"
            :loading="loading"
            @click="migratePool"
            class="button-primary"
          >
            Migrate
          </ButtonMigrate>
          <ButtonMigrate
            v-else
            :disabled="isDisabled"
            :loading="loading"
            @click="unlockPool"
            class="button-primary"
          >
            Unlock
          </ButtonMigrate>
        </div>
        <div class="mt-5 d-flex impact-label" @click="toggleAdvancedOptions">
          Price impact:
          {{ isFullMigration ? _num(priceImpact, 'percent') : '0%' }}
          <div class="ml-1">
            <Icon v-if="advancedOptions" name="arrow-up" />
            <Icon v-else name="arrow-down" />
          </div>
        </div>
        <div v-if="advancedOptions">
          <div class="options mt-3">
            <div
              class="option d-flex flex-items-center p-3"
              @click="isFullMigration = true"
            >
              <div class="option-input" :class="{ active: isFullMigration }">
                <div class="option-input-circle" v-if="isFullMigration"></div>
              </div>
              <div class="ml-3">
                <div class="option-type">
                  Migrate fully, no tokens left behind
                </div>
                <div class="option-impact">
                  {{ _num(priceImpact, 'percent') }} price impact
                </div>
              </div>
            </div>
            <div
              class="option d-flex flex-items-center p-3"
              @click="isFullMigration = false"
            >
              <div class="option-input" :class="{ active: !isFullMigration }">
                <div class="option-input-circle" v-if="!isFullMigration"></div>
              </div>
              <div class="ml-3">
                <div class="option-type">
                  Migrate with minimal price impact
                </div>
                <div class="option-impact">
                  0% price impact
                </div>
              </div>
            </div>
          </div>
          <div class="slippage">
            <div class="slippage-header">
              Slippage tolerance
            </div>
            <div class="d-flex">
              <div class="d-flex">
                <div
                  v-for="option in slippageOptions"
                  :key="option"
                  class="slippage-option"
                  :class="{
                    selected: (slippage === option) & !isCustomSlippage
                  }"
                  @click="setSlippage(option)"
                >
                  {{ formatSlippage(option) }}
                </div>
                <input
                  v-model="slippageInput"
                  class="slippage-option"
                  :class="{ selected: isCustomSlippage }"
                  placeholder="2.0"
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { getAddress } from '@ethersproject/address';
import Pool from '@/_balancer/pool';
import PoolV2 from '@/_balancer/pool2';
import { bnum, scale } from '@/helpers/utils';
import { getPoolLiquidity } from '@/helpers/price';
import { getNewPool, calculatePriceImpact } from '@/helpers/migration';
import config from '@/config';

const MAX_PRICE_IMPACT = 0.01;

export default {
  data() {
    return {
      pool: this.$route.params.id,
      loading: false,
      advancedOptions: false,
      poolStatDetails: false,
      isFullMigration: true,
      allowance: '0',
      balance: '0',
      liquidity: 0,
      poolV1: {
        address: '',
        liquidity: 0,
        volume: 0,
        swapFee: 0
      },
      poolV2: {
        address: '',
        liquidity: 0,
        volume: 0,
        swapFee: 0
      },
      priceImpact: '0',
      slippage: 0.005,
      slippageInput: '',
      slippageOptions: [0.001, 0.002, 0.005, 0.01]
    };
  },
  computed: {
    isUnlocked() {
      const allowanceNumber = bnum(this.allowance);
      const balanceNumber = bnum(this.balance);
      return !balanceNumber.isZero() || allowanceNumber.gte(balanceNumber);
    },
    isDisabled() {
      if (this.isUnlocked) {
        const balanceNumber = bnum(this.balance);
        return balanceNumber.isZero();
      } else {
        return false;
      }
    },
    isCustomSlippage() {
      return !this.slippageOptions.includes(this.slippage);
    }
  },
  async mounted() {
    await this.fetchPool();
    await this.fetchPoolV2();
    this.priceImpact = calculatePriceImpact(
      this.balance,
      this.poolV1,
      this.poolV2
    );
    if (this.priceImpact > MAX_PRICE_IMPACT) {
      this.isFullMigration = false;
    }
  },
  methods: {
    ...mapActions([
      'approve',
      'migrateAll',
      'migrateProportionally',
      'getBalances',
      'getAllowances'
    ]),
    async fetchPool() {
      const pool = new Pool(this.pool);
      this.poolV1 = await pool.getMetadata();
      this.poolV1.address = this.pool;
      this.poolV1.liquidity = getPoolLiquidity(this.poolV1, this.price.values);
      this.poolV1.volume = 0;
      if (this.web3.account) {
        const data = await Promise.all([
          this.getAllowances([this.pool]),
          this.getBalances([this.pool])
        ]);
        this.allowance = data[0][this.pool][this.web3.dsProxyAddress];
        this.balance = data[1][this.pool];
      }
      const balanceNumber = scale(bnum(this.balance), -18);
      this.liquidity = balanceNumber
        .div(this.poolV1.totalShares)
        .times(this.poolV1.liquidity);
    },
    async fetchPoolV2() {
      const address = getNewPool(this.pool);
      const poolV2 = new PoolV2(address);
      this.poolV2 = await poolV2.getMetadata();
      const totalWeight = this.poolV2.tokens.reduce(
        (total, token) => total.plus(token.denormWeight),
        bnum(0)
      );
      const poolData = {
        tokens: this.poolV2.tokens.map((token, index) => {
          const weightNumber = bnum(this.poolV2.tokens[index].denormWeight);
          const decimals = this.poolV1.tokens.find(
            t => t.address === token.address.toLowerCase()
          ).decimals;
          return {
            checksum: getAddress(token.address),
            balance: scale(bnum(this.poolV2.tokens[index].balance), -decimals),
            weightPercent: weightNumber
              .div(totalWeight)
              .times(100)
              .toNumber()
          };
        })
      };
      this.poolV2.address = address;
      this.poolV2.liquidity = getPoolLiquidity(poolData, this.price.values);
      const swapFeeNumber = scale(bnum(this.poolV2.swapFee), -18);
      this.poolV2.swapFee = swapFeeNumber.toString();
      this.poolV2.volume = 0;
    },
    async migratePool() {
      const poolV1Amount = bnum(this.balance)
        .times(0.1)
        .toFixed(0);
      const vault = config.addresses.vault;
      const poolIn = this.poolV1.address;
      const poolInAmount = poolV1Amount;
      const tokenOutAmountsMin = ['0', '0'];
      const poolOut = this.poolV2.address;
      // TODO calculate slippage based amounts (min)
      const poolOutAmountMin = '0';
      this.loading = true;
      if (this.isFullMigration) {
        await this.migrateAll({
          vault,
          poolIn,
          poolInAmount,
          tokenOutAmountsMin,
          poolOut,
          poolOutAmountMin
        });
      } else {
        await this.migrateProportionally({
          vault,
          poolIn,
          poolInAmount,
          tokenOutAmountsMin,
          poolOut,
          poolOutAmountMin
        });
      }
      this.loading = false;
    },
    async unlockPool() {
      this.loading = true;
      await this.approve(this.pool);
      const data = await this.getAllowances([this.pool]);
      this.allowance = data[this.pool][this.web3.dsProxyAddress];
      this.loading = false;
    },
    toggleAdvancedOptions() {
      this.advancedOptions = !this.advancedOptions;
    },
    handleToggleStats() {
      this.poolStatDetails = !this.poolStatDetails;
    },
    formatSlippage(slippageNumber) {
      return `${(slippageNumber * 100).toFixed(1)}%`;
    },
    setSlippage(slippageNumber) {
      this.slippage = slippageNumber;
    }
  }
};
</script>

<style scoped>
.page {
  flex-direction: column;
  color: white;
}

.migrate {
  width: 440px;
  margin: 30px auto;
  padding: 28px 26px;
  display: flex;
  flex-direction: column;
  border: 1px solid #333333;
  border-radius: 25px;
  background: #21222c;
}

.arrow {
  margin: 8px 0;
  display: flex;
  justify-content: center;
  font-size: 18px;
  color: #90a4ae;
}

.impact-label {
  color: #90a4ae;
  cursor: pointer;
}

.options {
  border: 1px solid #2e2e2e;
  border-radius: 5px;
}

.option {
  cursor: pointer;
}

.option:not(:first-child) {
  border-top: 1px solid #2e2e2e;
}

.option-input {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #616161;
  border-radius: 50%;
}

.option-input.active {
  background: #44d7b6;
  border: none;
}

.option-input-circle {
  width: 8px;
  height: 8px;
  background: #21222c;
  border-radius: 50%;
}

.option-type {
  font-size: 16px;
  font-weight: bold;
}

.option-impact {
  color: #90a4ae;
}

.slippage {
  margin-top: 16px;
}

.slippage-header {
  font-weight: bold;
  margin-bottom: 8px;
}

.slippage-option {
  height: 44px;
  width: 56px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
  border-radius: 5px;
  background: #1f2029;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

input.slippage-option {
  padding: 0;
  outline: none;
  color: #fff;
  font-size: 16px;
  text-align: center;
  cursor: text;
  box-shadow: none;
}

.slippage-option.selected {
  border-color: #fff;
}
</style>
