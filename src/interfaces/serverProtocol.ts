interface ServerProtocol {
  readonly '@type': keyof typeof types;
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
  readonly maxFlights?: number;
  readonly updateRate?: number;
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
  readonly updateRate?: number;
}

export interface StopTop extends ServerProtocol {
  readonly '@type': typeof types.stopTop;
}

export interface StartTotal extends ServerProtocol {
  readonly '@type': typeof types.startTotal;
  readonly updateRate?: number;
}

export interface StopTotal extends ServerProtocol {
  readonly '@type': typeof types.stopTotal;
}
