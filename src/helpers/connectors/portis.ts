import Portis from '@portis/web3';

export default async function() {
  let provider;
  try {
    const portis = new Portis(process.env.VUE_APP_PORTIS_DAPP_ID, 'mainnet');
    await portis.provider.enable();
    portis.provider._portis = portis;
    provider = portis.provider;
  } catch (e) {
    console.error(e);
  }
  return provider;
}
