import { State } from '@/interfaces/store';
import { GetterTree } from 'vuex';
import { WebSocketSubject } from 'rxjs/webSocket';

const getters: GetterTree<State, any> = {
  maximized: (state: State): boolean => state.maximized,
  maxFlights: (state: State): number => state.configuration.maxFlights,
  maxSpeed: (state: State): number => state.maxSpeed,
  socket: (state: State): (WebSocketSubject<unknown> | undefined) => state.socket,
  updateRate: (state: State): number => state.configuration.updateRate,
};

export {
  getters,
};
