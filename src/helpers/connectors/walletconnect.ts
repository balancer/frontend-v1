import WalletConnectProvider from '@walletconnect/web3-provider';

export default async function() {
  let provider;
  try {
    provider = new WalletConnectProvider({
      infuraId: process.env.VUE_APP_INFURA_ID
    });
    await provider.enable();
  } catch (e) {
    console.error(e);
  }
  return provider;
}
