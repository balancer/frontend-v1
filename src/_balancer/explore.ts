import { multicall } from '@snapshot-labs/snapshot.js/src/utils';
import abi from '@/helpers/abi';
import config from '@/config';
import { unknownColors } from '@/helpers/utils';
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
      .map(pool => pool[1].tokensList.map(token => [pool[0], token]))
      .reduce((a, b) => a.concat(b))
      .map(([poolId, token]) => {
        const tokenCalls = [
          ['decimals', 'decimals'],
          ['totalSupply', 'totalSupply'],
          ['balance', 'balanceOf', [poolId]],
          ['denormWeight', 'getDenormalizedWeight', [token]]
        ];
        if (!tokenInvalids.includes(token)) {
          tokenCalls.push(['name', 'name']);
          tokenCalls.push(['symbol', 'symbol']);
        }
        return [
          `${poolId}-${token}`,
          tokenCalls.map(call => {
            i++;
            const address = call[0] === 'denormWeight' ? poolId : token;
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
  const tokens = groupResult(groupCalls, result);

  Object.entries(tokens).forEach(token => {
    const [poolId, address] = token[0].split('-');
    if (!pools[poolId].tokens) pools[poolId].tokens = [];
    pools[poolId].tokens.push({ ...token[1], address });
  });

  pools = Object.fromEntries(
    Object.entries(pools).map(pool => {
      let colorIndex = 0;
      pool[1].address = pool[0];
      pool[1].tokens = pool[1].tokens
        .map(token => {
          if (config.tokens[token.address]) {
            token.color = config.tokens[token.address].color;
          } else {
            token.color = unknownColors[colorIndex];
            colorIndex++;
          }
          token.weight =
            (100 / parseFloat(formatUnits(pool[1].totalDenormWeight))) *
            parseFloat(formatUnits(token.denormWeight));
          return token;
        })
        .sort((a, b) => b.weight.toString() - a.weight.toString(), 0);
      return pool;
    })
  );

  return pools;
}

export function getPoolLiquidity(pool, prices) {
  let poolLiquidity = 0;
  const tokens: any = Object.values(pool.tokens);
  const totalWeight = tokens
    .map((token: any) => parseFloat(formatUnits(token.denormWeight)))
    .reduce((a, b) => a + b, 0);
  for (const token of tokens) {
    const price = prices[getAddress(token.address)];
    if (!price) continue;
    const tokenWeight = parseFloat(formatUnits(token.denormWeight));
    const tokenValue =
      parseFloat(formatUnits(token.balance, token.decimals)) * price;
    poolLiquidity = (tokenValue / tokenWeight) * totalWeight;
  }
  return poolLiquidity;
}
