
export interface State {
  paused: boolean;
  maxSpeed: number;
  map: Map;
}

interface Map {
  range: number;
  maximized: boolean;
}

interface Development {
  socket: string;
  query: string|null;
  requesting: boolean;
}
