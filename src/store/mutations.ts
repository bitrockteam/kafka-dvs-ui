import { State } from '@/interfaces/store';
import { MutationTree } from 'vuex';
import { queryGenerator, Query } from '@/libs/query';

const mutations: MutationTree<State> = {
  togglePause(currentState: State) {
    currentState.paused = !currentState.paused;
  },
  startRequest(currentState: State) {
    currentState.dev.requesting = true;
  },
  stopRequest(currentState: State) {
    currentState.dev.requesting = false;
  },
  updateQuery(currentState: State, evt: KeyboardEvent) {
    const query: string = evt.target ?
      (evt.target as HTMLInputElement).value : '';
    currentState.dev.query = query;
  },
  updateSocket(currentState: State, socket: string) {
    currentState.dev.socket = socket;
  },
  resetQuery(currentState: State) {
    const $query: Query = queryGenerator();

    currentState.sessionIDs.push($query.id);
    currentState.dev.query = $query.text;
  },
  resetDev(currentState: State) {
    const $query: Query = queryGenerator();

    currentState.sessionIDs.push($query.id);
    currentState.dev = {
      query: $query.text,
      requesting: false,
      socket: '',
    };
  },
  cleanSessions(currentState: State) {
    currentState.sessionIDs = [];
  },
  toggleMaximize(currentState: State) {
    currentState.map.maximized = !currentState.map.maximized;
  },
};

export {
  mutations,
};
