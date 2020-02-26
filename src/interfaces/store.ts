import { WebSocketSubject } from 'rxjs/webSocket';

interface SocketConfiguration {
  maxFlights: number;
  updateRate: number;
}

export interface State {
  configuration: SocketConfiguration;
  paused: boolean;
  maxSpeed: number;
  maximized: boolean;
  socket?: WebSocketSubject<unknown>;
}
