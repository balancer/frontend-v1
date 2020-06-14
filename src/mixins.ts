import store from '@/store';
import { mapState } from 'vuex';

// @ts-ignore
const modules = Object.entries(store.state).map(module => module[0]);

export default {
  computed: {
    ...mapState(modules)
  }
};
