import { ipfsGet, multicall } from '@snapshot-labs/snapshot.js/src/utils';
import abi from '@/helpers/abi';
import config from '@/config';
import { unknownColors } from '@/helpers/utils';
import BigNumber from '@/helpers/bignumber';
import { getAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';

const tokenInvalids = [
  '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // MKR
  '0xBB6cB01Bbc5F587B6E871B1130C06bb6B0CEaa0d', // MALTA1
  '0x55F044cE437085CA8a0B6eB2BeA500c32C0812c1' // MALTA2
];

function groupResult(groupCalls, result) {
  return Object.fromEntries(
    Object.entries(groupCalls).map(([key, groupCall]) => [
      key,
      Object.fromEntries(
        // @ts-ignore
        groupCall.map(call => {
          const [value] = result[call.id];
          return [call.name, value];
        })
      )
    ])
  );
}

function ungroupCalls(groupCalls) {
  // @ts-ignore
  return Object.values(groupCalls)
    .reduce((a: any, b) => a.concat(b))
    .map(call => call.call);
}

export async function getPools(network, provider, poolIds) {
  let i = 0;
  let groupCalls = Object.fromEntries(
    poolIds.map(poolId => [
      poolId,
      [
        ['controller', 'getController'],
        ['totalDenormWeight', 'getTotalDenormalizedWeight'],
        ['tokensList', 'getCurrentTokens'],
        ['finalized', 'isFinalized'],
        ['publicSwap', 'isPublicSwap'],
        ['swapFee', 'getSwapFee'],
        ['totalSupply', 'totalSupply']
      ].map(call => {
        i++;
        return {
          id: i - 1,
          name: call[0],
          call: [poolId, call[1], call[2]]
        };
      })
    ])
  );
  let result = await multicall(
    network.toString(),
    provider,
    abi['BPool'],
    ungroupCalls(groupCalls)
  );
  let pools = groupResult(groupCalls, result);

  i = 0;
  groupCalls = Object.fromEntries(
    Object.entries(pools)
      .map(pool => pool[1].tokensList.map(poolToken => [pool[0], poolToken]))
      .reduce((a, b) => a.concat(b))
      .map(([poolId, poolToken]) => {
        const tokenCalls = [
          ['decimals', 'decimals'],
          ['totalSupply', 'totalSupply'],
          ['balance', 'balanceOf', [poolId]],
          ['denormWeight', 'getDenormalizedWeight', [poolToken]]
        ];
        if (!tokenInvalids.includes(poolToken)) {
          tokenCalls.push(['name', 'name']);
          tokenCalls.push(['symbol', 'symbol']);
        }
        return [
          `${poolId}-${poolToken}`,
          tokenCalls.map(call => {
            i++;
            const address = call[0] === 'denormWeight' ? poolId : poolToken;
            return {
              id: i - 1,
              name: call[0],
              call: [address, call[1], call[2]]
            };
          })
        ];
      })
  );
  result = await multicall(
    network.toString(),
    provider,
    abi['BPool'],
    ungroupCalls(groupCalls)
  );
  const poolTokens = groupResult(groupCalls, result);

  Object.entries(poolTokens).forEach(poolToken => {
    const [poolId, address] = poolToken[0].split('-');
    if (!pools[poolId].poolTokens) pools[poolId].poolTokens = [];
    pools[poolId].poolTokens.push({ ...poolToken[1], address });
  });

  pools = Object.fromEntries(
    Object.entries(pools).map(pool => {
      let colorIndex = 0;
      pool[1].address = pool[0];
      pool[1].poolTokens = pool[1].poolTokens
        .map(poolToken => {
          if (config.tokens[poolToken.address]) {
            poolToken.color = config.tokens[poolToken.address].color;
          } else {
            poolToken.color = unknownColors[colorIndex];
            colorIndex++;
          }
          poolToken.weight = new BigNumber(100)
            .div(pool[1].totalDenormWeight.toString())
            .times(poolToken.denormWeight.toString());
          return poolToken;
        })
        .sort((a, b) => b.weight.toString() - a.weight.toString(), 0);
      return pool;
    })
  );

  return pools;
}

export function getPoolLiquidity(pool, prices) {
  let poolLiquidity = 0;
  const poolTokens: any = Object.values(pool.poolTokens);
  const totalWeight = poolTokens
    .map((poolToken: any) => parseFloat(formatUnits(poolToken.denormWeight)))
    .reduce((a, b) => a + b, 0);
  for (const poolToken of poolTokens) {
    const price = prices[getAddress(poolToken.address)];
    if (!price) continue;
    const poolTokenWeight = parseFloat(formatUnits(poolToken.denormWeight));
    const poolTokenValue =
      parseFloat(formatUnits(poolToken.balance, poolToken.decimals)) * price;
    poolLiquidity = (poolTokenValue / poolTokenWeight) * totalWeight;
  }
  return poolLiquidity;
}

export async function getLists() {
  // const random = Math.random();
  return await ipfsGet(
    'cloudflare-ipfs.com',
    `balancer-team-bucket.storage.fleek.co/balancer/tokenlists/explore`,
    'ipns'
  );
}
