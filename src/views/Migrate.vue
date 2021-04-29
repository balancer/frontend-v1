<template>
  <div class="page d-flex">
    <div class="migrate">
      <h3>Upgrade to V2</h3>
      <div class="mt-6">
        <MigrationStripe
          :pool-v1="poolV1"
          :pool-v2="poolV2"
          :liquidity="liquidity"
          :loading="loading"
        />
        <div class="stats d-flex flex-justify-between mt-4">
          <div>
            <MigrationStats
              :pool="poolV1"
              :is-v1="true"
              :details="poolStatDetails"
              :loading="loading"
              @toggle-details="handleToggleStats"
            />
          </div>
          <div class="arrow">→</div>
          <div>
            <MigrationStats
              :pool="poolV2"
              :is-v1="false"
              :details="poolStatDetails"
              :loading="loading"
              @toggle-details="handleToggleStats"
            />
            <MigrationWallet
              class="mt-2"
              v-if="leftoverAssets.length > 0"
              :assets="leftoverAssets"
              :loading="loading"
            />
          </div>
        </div>
        <div class="mt-4 d-flex flex-justify-center">
          <ButtonMigrate
            v-if="isUnlocked"
            :disabled="isDisabled"
            :pending="pendingTx"
            @click="migratePool"
            class="button-primary"
          >
            Migrate
          </ButtonMigrate>
          <ButtonMigrate
            v-else
            :disabled="isDisabled"
            :pending="pendingTx"
            @click="unlockPool"
            class="button-primary"
          >
            Unlock
          </ButtonMigrate>
        </div>
        <div v-if="loading" class="mt-5 impact-label-loading">
          <div class="bg-gray rounded-1 anim-pulse" />
        </div>
        <div
          v-else
          class="mt-5 d-flex impact-label"
          @click="toggleAdvancedOptions"
        >
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
              @click="setMigrationType(true)"
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
              @click="setMigrationType(false)"
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
import {
  getNewPool,
  calculateMinAmount,
  calculatePriceImpact,
  getLeftoverAssets
} from '@/helpers/migration';
import config from '@/config';

const MAX_PRICE_IMPACT = 0.01;

export default {
  data() {
    return {
      pool: this.$route.params.id,
      loading: true,
      pendingTx: false,
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
      priceImpact: 0,
      leftoverAssets: []
    };
  },
  computed: {
    isUnlocked() {
      const allowanceNumber = bnum(this.allowance);
      const balanceNumber = bnum(this.balance);
      return balanceNumber.isZero() || allowanceNumber.gte(balanceNumber);
    },
    isDisabled() {
      if (this.isUnlocked) {
        const balanceNumber = bnum(this.balance);
        return balanceNumber.isZero();
      } else {
        return false;
      }
    }
  },
  async mounted() {
    await this.fetchPool();
    await this.fetchPoolV2();
    this.loading = false;
    this.priceImpact = calculatePriceImpact(
      this.balance,
      this.poolV1,
      this.poolV2
    );
    if (this.priceImpact > MAX_PRICE_IMPACT) {
      this.isFullMigration = false;
    }
    this.leftoverAssets = getLeftoverAssets(
      this.balance,
      this.poolV1,
      this.poolV2,
      this.isFullMigration
    );
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
      const vault = config.addresses.vault;
      const poolIn = this.poolV1.address;
      const poolInAmount = this.balance;
      const tokenOutAmountsMin = this.poolV1.tokens.map(() => '0');
      const poolOut = this.poolV2.address;
      const poolOutAmountMin = calculateMinAmount(
        this.isFullMigration,
        this.balance,
        this.poolV1,
        this.poolV2
      );
      this.pendingTx = true;
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
      this.pendingTx = false;
    },
    async unlockPool() {
      this.pendingTx = true;
      await this.approve(this.pool);
      const data = await this.getAllowances([this.pool]);
      this.allowance = data[this.pool][this.web3.dsProxyAddress];
      this.pendingTx = false;
    },
    setMigrationType(isFullMigration) {
      this.isFullMigration = isFullMigration;
      this.leftoverAssets = getLeftoverAssets(
        this.balance,
        this.poolV1,
        this.poolV2,
        isFullMigration
      );
    },
    toggleAdvancedOptions() {
      this.advancedOptions = !this.advancedOptions;
    },
    handleToggleStats() {
      this.poolStatDetails = !this.poolStatDetails;
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

.impact-label-loading {
  height: 19.6px;
}

.impact-label-loading > div {
  height: 90%;
  width: 30%;
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
</style>
