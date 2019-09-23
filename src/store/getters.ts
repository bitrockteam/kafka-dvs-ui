import { State } from '@/interfaces/store';
import { GetterTree } from 'vuex';

const getters: GetterTree<State, any> = {
  query: (state: State): string | null => state.dev.query,
  requesting: (state: State): boolean => state.dev.requesting,
  devSocket: (state: State): string => state.dev.socket,
  getSessions: (state: State): string[] => state.sessionIDs,
  mapRange: (state: State): number => state.map.range,
  maximized: (state: State): boolean => state.map.maximized,
};

export {
  getters,
};
