import { State } from '@/interfaces/store';
import { MutationTree } from 'vuex';
import MaxSpeedFlight from '@/libs/classes/max-speed-flight';
import { CoordinatesBox } from '@/interfaces/serverProtocol';

const mutations: MutationTree<State> = {
  latestBox(currentState: State, latestBox: CoordinatesBox) {
    currentState.latestBox = latestBox;
  },
  togglePause(currentState: State) {
    currentState.paused = !currentState.paused;
  },
  setMaxSpeed(currentState: State, speed: number) {
    currentState.maxSpeed = speed;
  },
  toggleBoxedMaxSpeedFlightPopup(currentState: State, maxSpeedFlight?: MaxSpeedFlight) {
    currentState.boxedMapSpeedFlight = maxSpeedFlight;
  },
};

export {
  mutations,
};
