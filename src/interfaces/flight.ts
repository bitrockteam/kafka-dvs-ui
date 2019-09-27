export interface Flight {
  iataNumber: string;
  icaoNumber: string;
  speed: number;
  geography: GeographyInfo;
  status: string;
  updated: string;
  airportDeparture: AirportInfo ;
  airportArrival: AirportInfo;
  airline: AirlineInfo;
  airplane?: AirplaneInfo;
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
