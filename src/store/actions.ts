import { ActionTree, ActionContext } from 'vuex';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { State } from '@/interfaces/store';
import { CoordinatesBox, Precedence, types } from '@/interfaces/serverProtocol';
import TopSelectedItem from '@/libs/classes/top-selected-item';
import { fromTopSelectedItem } from '@/libs/precedence.factory';

const actions: ActionTree<State, any> = {
  attachWebSocket({ state }, url: string): WebSocketSubject<unknown> {
    if (!state.socket) {
      state.socket = webSocket(url);
    }
    return state.socket;
  },
  startFlightList({ commit, state: { socket } }, message: CoordinatesBox): void {
    if (socket) {
      socket.next(message);
      commit('latestBox', message);
    }
  },
  stopFlightList({ state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.stopFlightList });
    }
  },
  startTop({ getters, state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.startTop, 'updateRate': getters.updateRate });
    }
  },
  stopTop({ state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.stopTop });
    }
  },
  startTotal({ getters, state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.startTotal, 'updateRate': getters.updateRate });
    }
  },
  stopTotal({ state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.stopTotal });
    }
  },
  toggleMaximize({ dispatch, state }: ActionContext<State, any>): void {
    state.maximized = !state.maximized;
    if (state.maximized) {
      dispatch(types.startTop);
      dispatch(types.startTotal);
    } else {
      dispatch(types.stopTop);
      dispatch(types.stopTotal);
    }
  },
  topSelectedItem({ dispatch, getters, state }: ActionContext<State, any>, item?: TopSelectedItem) {
    state.topSelectedItem = item;
    if (!!item) {
      dispatch(types.stopTop);
    } else {
      dispatch(types.startTop);
    }
    if (!state.paused) {
      dispatch(types.startFlightList, { ...state.latestBox, precedence: fromTopSelectedItem(getters.topSelectedItem) });
    }
  },
};

export {
    actions,
};
