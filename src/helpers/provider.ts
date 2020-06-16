let provider;

if (!!window['ethereum'] || !!window['web3']) {
  provider = window['ethereum'] || window['web3'];
}

export const connectToInjected = async () => {
  if (window['ethereum']) {
    provider = window['ethereum'];
    try {
      await window['ethereum'].enable();
    } catch (error) {
      throw new Error('User Rejected');
    }
  } else if (window['web3']) {
    provider = window['web3'].currentProvider;
  } else {
    throw new Error('No Web3 Provider found');
  }
};

export default provider;
