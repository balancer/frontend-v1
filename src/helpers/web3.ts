import { Contract } from '@ethersproject/contracts';
import { getAddress } from '@ethersproject/address';
import abi from '@/helpers/abi';
import { GAS_LIMIT_BUFFER, isTxRejected, logRevertedTx } from '@/helpers/utils';
import provider from '@/helpers/provider';
import { Interface } from '@ethersproject/abi';

export async function sendTransaction(
  web3,
  [contractType, contractAddress, action, params, overrides]: any
) {
  const signer = web3.getSigner();
  const contract = new Contract(
    getAddress(contractAddress),
    abi[contractType],
    web3
  );
  const contractWithSigner = contract.connect(signer);
  try {
    // Gas estimation
    const gasLimitNumber = await contractWithSigner.estimateGas[action](
      ...params,
      overrides
    );
    const gasLimit = gasLimitNumber.toNumber();
    overrides.gasLimit = Math.floor(gasLimit * (1 + GAS_LIMIT_BUFFER));
    return await contractWithSigner[action](...params, overrides);
  } catch (e) {
    if (isTxRejected(e)) return Promise.reject();
    // Use gas price field to store tx sender since "from" will be overwritten
    overrides.gasPrice = signer.getAddress();
    logRevertedTx(provider, contract, action, params, overrides);
    return Promise.reject(e);
  }
}

export function makeProxyTransaction(
  dsProxy,
  [contractType, contractAddress, action, params, overrides]: any
) {
  const iface = new Interface(abi[contractType]);
  const data = iface.encodeFunctionData(action, params);
  return ['DSProxy', dsProxy, 'execute', [contractAddress, data], overrides];
}
