
export interface State {
  paused: boolean;
  dev: Development;
  sessionIDs: string[];
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
