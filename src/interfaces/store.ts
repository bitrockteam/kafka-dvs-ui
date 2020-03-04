import { WebSocketSubject } from 'rxjs/webSocket';
import TopSelectedItem from '@/libs/classes/top-selected-item';
import MaxSpeedFlight from '@/libs/classes/max-speed-flight';

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
  boxedMapSpeedFlight?: MaxSpeedFlight;
}
