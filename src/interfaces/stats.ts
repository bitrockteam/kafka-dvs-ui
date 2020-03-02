export interface StatData {
  name?: string;
  type: string;
  count: number|string;
  percent: number;
  format?: string;
}

export interface CountAirline {
  eventCount: number;
}

export interface SpeedFlight {
  flightCode: string;
  speed: number;
}

export interface TopSpeedList {
 elements: [SpeedFlight];
}

export interface Airport {
  airportCode: string;
  eventCount: number;
}

export interface TopArrivalAirportList {
  elements: [Airport];
}

export interface TopDepartureAirportList {
  elements: [Airport];
}

export interface Airline {
  airlineName: string;
  eventCount: number;
}

export interface TopAirlineList {
  elements: [Airline];
}
