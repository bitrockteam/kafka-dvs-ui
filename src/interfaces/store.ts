import { WebSocketSubject } from 'rxjs/webSocket';

export interface State {
  paused: boolean;
  maxSpeed: number;
  maximized: boolean;
  socket?: WebSocketSubject<unknown>;
}
