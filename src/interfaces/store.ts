import { WebSocketSubject } from 'rxjs/webSocket';
import TopSelectedItem from '@/libs/classes/top-selected-item';

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
  topSelectedItem?: TopSelectedItem;
}
