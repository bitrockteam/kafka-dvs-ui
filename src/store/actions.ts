import { ActionTree } from 'vuex';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { State } from '@/interfaces/store';
import { CoordinatesBox, types } from '@/interfaces/serverProtocol';
import { store } from '@/store';

const actions: ActionTree<State, any> = {
  attachWebSocket({ state }, url: string): WebSocketSubject<unknown> {
    if (!state.socket) {
      state.socket = webSocket(url);
    }
    return state.socket;
  },
  startFlightList({ state: { socket } }, message: CoordinatesBox): void {
    if (socket) {
      socket.next(message);
    }
  },
  stopFlightList({ state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.stopFlightList });
    }
  },
  startTop({ state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.startTop, 'updateRate': store.getters.updateRate });
    }
  },
  stopTop({ state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.stopTop });
    }
  },
  startTotal({ state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.startTotal, 'updateRate': store.getters.updateRate });
    }
  },
  stopTotal({ state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.stopTotal });
    }
  },
};

export {
    actions,
};
