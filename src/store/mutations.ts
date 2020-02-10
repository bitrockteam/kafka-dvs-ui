import { State } from '@/interfaces/store';
import { types } from '@/interfaces/serverProtocol';
import { store } from '@/store';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  togglePause(currentState: State) {
    currentState.paused = !currentState.paused;
  },
  toggleMaximize(currentState: State) {
    currentState.maximized = !currentState.maximized;
    if (currentState.maximized) {
      store.dispatch(types.startTop);
      store.dispatch(types.startTotal);
    } else {
      store.dispatch(types.stopTop);
      store.dispatch(types.stopTotal);
    }
  },
  setMaxSpeed(currentState: State, speed: number) {
    currentState.maxSpeed = speed;
  },
};

export {
  mutations,
};
