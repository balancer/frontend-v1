import numeral from 'numeral';
import { mapState } from 'vuex';
import store from '@/store';
import config from '@/config';
import { shortenAddress, shorten, trunc } from '@/helpers/utils';

// @ts-ignore
const modules = Object.entries(store.state).map(module => module[0]);

export default {
  data() {
    return {
      config
    };
  },
  computed: {
    ...mapState(modules)
  },
  methods: {
    _num(number, key) {
      let format = '(0.[00000]a)';
      format = number > 1 ? '(0.[0000]a)' : format;
      format = number > 10 ? '(0.[000]a)' : format;
      format = number > 100 ? '(0.[00]a)' : format;
      if (key === 'raw') format = '0,0.[000000]';
      if (key === 'currency') format = '$(0.[00]a)';
      if (key === 'raw-currency') format = '$(0,0.[00])';
      if (key === 'price') format = '$(0.[00]a)';
      if (key === 'percent') format = '(0.[00]a)%';
      if (key === 'percent-short') format = '(0a)%';
      if (number < 0.0001) number = 0;
      return numeral(number)
        .format(format)
        .toUpperCase();
    },
    _shortenAddress(str: string): string {
      return shortenAddress(str);
    },
    _shorten(str: string, max?): string {
      return shorten(str, max);
    },
    _trunc(value: number, decimals: number): number {
      return trunc(value, decimals);
    },
    _etherscanLink(str: string, type = 'address'): string {
      return `${config.explorer}/${type}/${str}`;
    },
    _ticker(address: string): string {
      if (address === 'ether') return 'ETH';
      const token = config.tokens[address];
      return token ? token.symbol : this._shortenAddress(address);
    },
    _precision(rawValue: number, address: string): number {
      const tokenConfig = config.tokens[address] || {};
      const precision = tokenConfig.precision || config.defaultPrecision;
      const value = rawValue.toFixed(precision);
      return parseFloat(value);
    }
  }
};
