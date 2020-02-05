export interface ServerProtocol {
  readonly '@type':
    | 'startFlightList'
    | 'stopFlightList'
    | 'startTop'
    | 'stopTop'
    | 'startTotal'
    | 'stopTotal';
}

export const types = {
  startFlightList: 'startFlightList' as const,
  stopFlightList: 'stopFlightList' as const,
  startTop: 'startTop' as const,
  stopTop: 'stopTop' as const,
  startTotal: 'startTotal' as const,
  stopTotal: 'stopTotal' as const,
};

export interface CoordinatesBox extends ServerProtocol {
  readonly '@type': typeof types.startFlightList;
  readonly leftHighLat: number;
  readonly leftHighLon: number;
  readonly rightLowLat: number;
  readonly rightLowLon: number;
}

export interface StopFlightList extends ServerProtocol {
  readonly '@type': typeof types.stopFlightList;
}

export interface StartTop extends ServerProtocol {
  readonly '@type': typeof types.startTop;
}

export interface StopTop extends ServerProtocol {
  readonly '@type': typeof types.stopTop;
}

export interface StartTotal extends ServerProtocol {
  readonly '@type': typeof types.startTotal;
}

export interface StopTotal extends ServerProtocol {
  readonly '@type': typeof types.stopTotal;
}
