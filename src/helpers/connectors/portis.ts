import Portis from '@portis/web3';

const dappId = process.env.VUE_APP_PORTIS_DAPP_ID || '';

export default async function() {
  let provider;
  try {
    const portis = new Portis(dappId, 'mainnet');
    await portis.provider.enable();
    portis.provider._portis = portis;
    provider = portis.provider;
  } catch (e) {
    console.error(e);
  }
  return provider;
}
