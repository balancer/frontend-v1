import merge from 'lodash/merge';
import { getAddress, isAddress } from '@ethersproject/address';
import {
  multicall,
  subgraphRequest
} from '@snapshot-labs/snapshot.js/src/utils';
import provider from '@/helpers/provider';
import abi from '@/helpers/abi';
import { poolRights, formatPool } from '@/helpers/utils';
import { formatUnits } from '@ethersproject/units';
import queries from '@/helpers/queries.json';
import pools from './pools.json';
import config from '@/config';
import { getPools } from '@/_balancer/explore';
import registry from '@/_balancer/registry';

export default class Pool {
  public readonly address: string;
  public readonly checksum: string;
  public ready = false;
  public config: any;
  public metadata?: any;

  constructor(address: string) {
    this.address = address.toLowerCase();
    this.checksum = isAddress(address) ? getAddress(address) : '';
    this.config = this.isWhitelisted() ? pools[this.address] : {};
  }

  isWhitelisted() {
    return Object.keys(pools)
      .map(crp => crp.toLowerCase())
      .includes(this.address);
  }

  getTypeStr() {
    return this.metadata.finalized
      ? 'Shared'
      : this.isCrp()
      ? 'Smart pool'
      : 'Private';
  }

  getBptPrice() {
    if (
      !this.metadata.liquidity ||
      !this.metadata.totalShares ||
      (!this.metadata.finalized && !this.isCrp())
    )
      return 0;
    return this.metadata.liquidity / this.metadata.totalShares;
  }

  isCrp() {
    if (this.isWhitelisted() && this.config.is_compatible) return true;
    return this.metadata.crp;
  }

  getBptAddress() {
    if (this.config.bptAddress) return this.config.bptAddress;
    return this.isCrp() ? this.metadata.controller : this.address;
  }

  async getMetadata() {
    const poolFromNode = await this.getNodeMetadata();
    let poolFromSubgraph = {};
    try {
      poolFromSubgraph = await this.getSubgraphMetadata();
    } catch (e) {
      console.log('Subgraph request failed', e);
    }
    this.metadata = formatPool({ ...poolFromNode, ...poolFromSubgraph });
    const crpMetadata = await this.getCrpMetadata();
    this.metadata = { ...this.metadata, ...crpMetadata };
    this.ready = true;
    return this.metadata;
  }

  async getCrpMetadata() {
    if (this.isCrp()) {
      const address = this.getBptAddress();
      const [
        publicSwap,
        name,
        decimals,
        symbol,
        totalShares,
        rights,
        bspCap,
        crpController,
        minimumWeightChangeBlockPeriod,
        addTokenTimeLockInBlocks,
        { startBlock, endBlock }
      ] = await multicall(
        config.chainId,
        provider,
        abi['ConfigurableRightsPool'],
        [
          'isPublicSwap',
          'name',
          'decimals',
          'symbol',
          'totalSupply',
          'rights',
          'bspCap',
          'getController',
          'minimumWeightChangeBlockPeriod',
          'addTokenTimeLockInBlocks',
          'gradualUpdate'
        ].map(method => [address, method, []])
      );
      return {
        publicSwap: publicSwap[0],
        name: name.toString(),
        symbol: symbol.toString(),
        totalShares: formatUnits(totalShares.toString(), decimals),
        rights: Object.fromEntries(
          Object.entries(poolRights).map((right, i) => [right[0], rights[i]])
        ),
        bspCap: formatUnits(bspCap.toString(), decimals),
        crpController: crpController[0],
        minimumWeightChangeBlockPeriod: minimumWeightChangeBlockPeriod.toString(),
        addTokenTimeLockInBlocks: addTokenTimeLockInBlocks.toString(),
        startBlock: startBlock.toString(),
        endBlock: endBlock.toString()
      };
    } else {
      return {};
    }
  }

  async getSubgraphMetadata() {
    const swapTsStart = Math.round(new Date().getTime() / 1000) - 24 * 3600;
    const query = {
      pool: {
        __args: {
          id: this.address
        },
        swaps: {
          __args: {
            where: {
              timestamp_lt: swapTsStart
            }
          }
        }
      }
    };

    const response = await subgraphRequest(
      config.subgraphUrl,
      merge(queries['getPool'], query)
    );
    return response.pool;
  }

  async getNodeMetadata() {
    const copy = await getPools(config.chainId, provider, [this.address]);
    const pool = copy[this.address];
    pool.controller = pool.controller.toLowerCase();
    pool.createTime = 0;
    pool.crp =
      registry.metadata[this.address].tags &&
      registry.metadata[this.address].tags.includes('smart-pool');
    pool.holdersCount = '0';
    pool.id = pool.address;
    pool.liquidity = '0';
    delete pool.address;
    pool.swapFee = formatUnits(pool.swapFee);
    pool.swapCount = '0';
    pool.tokens = pool.tokens.map(token => {
      token.address = token.address.toLowerCase();
      token.balance = formatUnits(token.balance, token.decimals);
      token.id = `${this.address}-${token.address}`;
      token.denormWeight = formatUnits(token.denormWeight);
      delete token.color;
      return token;
    });
    pool.totalSwapFee = '0';
    pool.totalSwapVolume = '0';
    pool.totalSwapVolume = '0';
    pool.totalWeight = formatUnits(pool.totalDenormWeight);
    delete pool.totalDenormWeight;
    pool.totalShares = formatUnits(pool.totalSupply);
    delete pool.totalSupply;
    pool.symbol = 'BPT';
    pool.name = 'Balancer Pool Token';
    pool.tx = '';
    pool.rights = [];
    pool.bspCap = 0;
    pool.minimumWeightChangeBlockPeriod = 10;
    pool.addTokenTimeLockInBlocks = 10;
    pool.gradualUpdate = [];
    return pool;
  }
}
