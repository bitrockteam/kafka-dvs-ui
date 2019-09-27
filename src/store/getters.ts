import { State } from '@/interfaces/store';
import { GetterTree } from 'vuex';

const getters: GetterTree<State, any> = {
  maximized: (state: State): boolean => state.maximized,
  maxSpeed: (state: State): number => state.maxSpeed,
};

export {
  getters,
};
