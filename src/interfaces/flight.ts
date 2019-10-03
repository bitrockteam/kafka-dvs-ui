export interface Flight {
  iataNumber: string;
  icaoNumber: string;
  speed: number;
  updated: string;
  geography: GeographyInfo;
  status: string;
  airportDeparture: AirportInfo ;
  airportArrival: AirportInfo;
  airline: AirlineInfo;
  airplane?: AirplaneInfo;
}

export interface FlightList {
  elements: [Flight]
}

interface GeographyInfo {
  latitude: number;
  longitude: number;
  altitude: number;
  direction: number;
}

interface AirportInfo {
  codeAirport: string;
  nameAirport: string;
  nameCountry: string;
  codeIso2Country: string;
  gmt: string;
  timezone: string;
}

interface AirplaneInfo {
  numberRegistration: string;
  productionLine: string;
  modelCode: string;
}

interface AirlineInfo {
  codeAirline: string;
  nameAirline: string;
  sizeAirline: string;
}
