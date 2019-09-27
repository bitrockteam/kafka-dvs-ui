import { State } from '@/interfaces/store';
import { MutationTree } from 'vuex';

const mutations: MutationTree<State> = {
  togglePause(currentState: State) {
    currentState.paused = !currentState.paused;
  },
  toggleMaximize(currentState: State) {
    currentState.maximized = !currentState.maximized;
  },
  setMaxSpeed(currentState: State, speed: number) {
    currentState.maxSpeed = speed;
  },
};

export {
  mutations,
};
