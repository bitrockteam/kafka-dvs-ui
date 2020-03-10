import { WebSocketSubject } from 'rxjs/webSocket';
import TopSelectedItem from '@/libs/classes/top-selected-item';
import MaxSpeedFlight from '@/libs/classes/max-speed-flight';
import { CoordinatesBox } from './serverProtocol';

interface SocketConfiguration {
  maxFlights: number;
  updateRate: number;
}

export interface State {
  configuration: SocketConfiguration;
  paused: boolean;
  latestBox?: CoordinatesBox;
  maxSpeed: number;
  maximized: boolean;
  socket?: WebSocketSubject<unknown>;
  topSelectedItem?: TopSelectedItem;
  boxedMapSpeedFlight?: MaxSpeedFlight;
}
