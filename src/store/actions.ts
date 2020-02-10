import { ActionTree } from 'vuex';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { State } from '@/interfaces/store';
import { CoordinatesBox, types } from '@/interfaces/serverProtocol';

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
      socket.next({ '@type': types.startTop });
    }
  },
  stopTop({ state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.stopTop });
    }
  },
  startTotal({ state: { socket } }): void {
    if (socket) {
      socket.next({ '@type': types.startTotal });
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
